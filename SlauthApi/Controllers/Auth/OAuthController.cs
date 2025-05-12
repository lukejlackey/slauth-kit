using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SlauthApi.Services.Integration;
using System;
using System.Threading.Tasks;

namespace SlauthApi.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/oauth")]
    public class OAuthController : ControllerBase
    {
        private readonly OAuthService _oauthService;
        private readonly IConfiguration _config;

        public OAuthController(OAuthService oauthService, IConfiguration config)
        {
            _oauthService = oauthService;
            _config = config;
        }

        [HttpGet("callback/{provider}")]
        public async Task<IActionResult> Callback(string provider, [FromQuery] string code)
        {
            if (string.IsNullOrEmpty(code))
                return BadRequest("Missing OAuth code.");

            try
            {
                var result = await _oauthService.HandleOAuthCallback(provider, code);
                if (result == null)
                    return Unauthorized("OAuth login failed.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OAuth error: {ex.Message}");
                return StatusCode(500, "OAuth callback error.");
            }
        }
    }
}
