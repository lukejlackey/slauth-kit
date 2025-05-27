using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using SlauthApi.Config;
using SlauthApi.Models.Domain;
using SlauthApi.Models.Responses;

namespace SlauthApi.Services.Integration
{
    public class OAuthService
    {
        private readonly IMongoCollection<User> _users;
        private readonly SlauthOptions _options;

        public OAuthService(SlauthOptions options)
        {
            _options = options;
            var client = new MongoClient(_options.MongoUri);
            var db = client.GetDatabase("slauthkit");
            _users = db.GetCollection<User>("users");
        }

        /// <summary>
        /// Exchange the OAuth code for a JWT-wrapped login response.
        /// </summary>
        public async Task<AuthResponse> HandleOAuthCallback(string providerKey, string code)
        {
            if (!_options.OAuthProviders.TryGetValue(providerKey, out var cfg))
                throw new ArgumentException($"Unknown provider '{providerKey}'");

            // 1) Exchange code for access_token
            using var http = new HttpClient();
            var redirectUri = cfg.RedirectUri; // stored in your SlauthOptions
            var tokenRequest = new Dictionary<string, string>
            {
                ["client_id"]     = cfg.ClientId,
                ["client_secret"] = cfg.ClientSecret,
                ["code"]          = code,
                ["redirect_uri"]  = redirectUri,
                ["grant_type"]    = "authorization_code"
            };

            var tokenResp = await http.PostAsync(cfg.TokenEndpoint, new FormUrlEncodedContent(tokenRequest));
            if (!tokenResp.IsSuccessStatusCode)
            {
                var body = await tokenResp.Content.ReadAsStringAsync();
                throw new Exception(
                    $"[{providerKey}] token exchange failed: {(int)tokenResp.StatusCode} {tokenResp.ReasonPhrase} — {body}"
                );
            }

            using var tokenDoc = JsonDocument.Parse(await tokenResp.Content.ReadAsStringAsync());
            var root = tokenDoc.RootElement;
            var accessToken = root.GetProperty("access_token").GetString()!
                ?? throw new Exception("access_token missing");

            // 2) Fetch profile
            http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", accessToken);

            var profileResp = await http.GetAsync(cfg.UserInfoEndpoint);
            if (!profileResp.IsSuccessStatusCode)
            {
                var body = await profileResp.Content.ReadAsStringAsync();
                throw new Exception(
                    $"[{providerKey}] profile fetch failed: {(int)profileResp.StatusCode} {profileResp.ReasonPhrase} — {body}"
                );
            }

            using var profileDoc = JsonDocument.Parse(await profileResp.Content.ReadAsStringAsync());
            var profile = profileDoc.RootElement;

            // 3) Extract providerId & email (provider-specific)
            string providerId = providerKey switch
            {
                "google"    => profile.GetProperty("sub").GetString()!,
                "github"    => profile.GetProperty("id").GetRawText(),
                "discord"   => profile.GetProperty("id").GetString()!,
                "microsoft" => profile.GetProperty("id").GetString()!,
                "facebook"  => profile.GetProperty("id").GetString()!,
                "twitter"   => profile.GetProperty("id_str").GetString()!,
                "apple"     => profile.GetProperty("sub").GetString()!,
                "gitlab"    => profile.GetProperty("id").GetRawText(),
                "linkedin"  => profile.GetProperty("id").GetString()!,
                "reddit"    => profile.GetProperty("id").GetString()!,
                "amazon"    => profile.GetProperty("user_id").GetString()!,
                "twitch"    => profile.GetProperty("id").GetString()!,
                _ => throw new Exception($"No providerId handler for '{providerKey}'")
            };

            string email = providerKey switch
            {
                "github" when !profile.TryGetProperty("email", out _) =>
                    throw new Exception("GitHub email missing; need separate /user/emails call"),
                _ => profile.GetProperty("email").GetString()!
            };

            // 4) Upsert user
            var filter = Builders<User>.Filter.Eq(u => u.Provider, providerKey)
                       & Builders<User>.Filter.Eq(u => u.ProviderId, providerId);
            var update = Builders<User>.Update
                .Set(u => u.Email, email)
                .Set(u => u.Provider, providerKey)
                .Set(u => u.ProviderId, providerId);
            var opts = new FindOneAndUpdateOptions<User>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };
            var user = await _users.FindOneAndUpdateAsync(filter, update, opts);

            // 5) Issue JWT
            var keyBytes = Encoding.UTF8.GetBytes(_options.JwtSecret);
            var creds = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);
            var claims = new[] { new Claim(ClaimTypes.Email, user.Email!) };
            var jwtToken = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );
            var jwtString = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            return new AuthResponse { Token = jwtString };
        }
    }
}
