using System;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SlauthApi.Config;
using SlauthApi.Services.Integration;
using SlauthApi.Models.Responses;

namespace SlauthApi.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/oauth")]
    public class OAuthController : ControllerBase
    {
        private readonly OAuthService _oauthService;
        private readonly SlauthOptions _options;

        public OAuthController(
            OAuthService oauthService,
            IOptions<SlauthOptions> optionsAccessor)
        {
            _oauthService = oauthService;
            _options = optionsAccessor.Value;
        }

        /// <summary>
        /// Initiate the OAuth dance by redirecting to the provider's auth URL.
        /// </summary>
        [HttpGet("{provider}")]
        public IActionResult Challenge([FromRoute] string provider)
        {
            if (!_options.OAuthProviders.TryGetValue(provider, out var cfg))
                return BadRequest($"Unknown OAuth provider '{provider}'.");

            var redirectUri = Url.Action(
                action: nameof(Callback),
                controller: "OAuth",
                values: new { provider },
                protocol: Request.Scheme);

            var qs = HttpUtility.ParseQueryString(string.Empty);
            qs["client_id"]     = cfg.ClientId;
            qs["redirect_uri"]  = redirectUri!;
            qs["response_type"] = "code";
            qs["scope"]         = string.Join(" ", cfg.Scopes ?? Array.Empty<string>());
            var state = Guid.NewGuid().ToString("N");
            qs["state"] = state;

            var authUrl = $"{cfg.AuthorizationEndpoint}?{qs}";
            return Redirect(authUrl);
        }

        /// <summary>
        /// Handle the OAuth provider callback with ?code=... (and optional state).
        /// </summary>
        [HttpGet("callback/{provider}")]
        public async Task<IActionResult> Callback(
            [FromRoute] string provider,
            [FromQuery] string code,
            [FromQuery] string? state = null)
        {
            if (string.IsNullOrEmpty(code))
                return BadRequest("Missing OAuth code.");

            try
            {
                AuthResponse result = await _oauthService.HandleOAuthCallback(provider, code);
                if (result == null)
                    return Unauthorized("OAuth login failed.");

                // redirect back into your SPA with the token in the URL
                return Redirect($"{_options.FrontendUri}?token={Uri.EscapeDataString(result.Token)}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OAuth error: {ex}");
                return StatusCode(500, "OAuth callback error.");
            }
        }
    }
}
