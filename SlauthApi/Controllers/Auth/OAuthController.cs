using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SlauthApi.Config;
using SlauthApi.Services.Integration;
using System;
using System.Linq;
using System.Web;

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

            // Build your callback URL dynamically:
            var redirectUri = Url.Action(
                action: nameof(Callback),
                controller: "OAuth",
                values: new { provider },
                protocol: Request.Scheme);

            // Build query params
            var qs = HttpUtility.ParseQueryString(string.Empty);
            qs["client_id"]     = cfg.ClientId;
            qs["redirect_uri"]  = redirectUri;
            qs["response_type"] = "code";
            qs["scope"]         = string.Join(" ", cfg.Scopes ?? Array.Empty<string>());
            // (Optionally) include state to mitigate CSRF
            var state = Guid.NewGuid().ToString("N");
            qs["state"]         = state;
            // TODO: store 'state' in cookie/session so you can verify it in Callback

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

            // TODO: verify 'state' matches what you issued in Challenge()

            try
            {
                var result = await _oauthService.HandleOAuthCallback(provider, code);
                if (result == null)
                    return Unauthorized("OAuth login failed.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OAuth error: {ex}");
                return StatusCode(500, "OAuth callback error.");
            }
        }
    }
}
