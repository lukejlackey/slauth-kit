using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using SlauthApi.Config;
using SlauthApi.Models.Requests;
using SlauthApi.Models.Domain;
using SlauthApi.Services.Data;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SlauthApi.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly SlauthOptions _options;

        public AuthController(UserService userService, IOptions<SlauthOptions> options)
        {
            _userService = userService;
            _options = options.Value;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            Console.WriteLine($"Signup hit with email: {request.Email}");
            var existing = await _userService.GetUserByEmail(request.Email);
            if (existing != null)
            {
                Console.WriteLine("User already exists.");
                return BadRequest("Email already exists.");
            }

            var user = new User
            {
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            Console.WriteLine("Creating user in Mongo...");
            await _userService.CreateUser(user);
            Console.WriteLine("User created.");

            return Ok("User created successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.GetUserByEmail(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                return Unauthorized("Invalid email or password.");

            var token = GenerateJwtToken(user.Email);
            return Ok(new { token });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var email = User?.FindFirstValue(ClaimTypes.Email);
            return Ok(new { email });
        }

        private string GenerateJwtToken(string email)
        {
            if (string.IsNullOrEmpty(_options.JwtSecret))
                throw new InvalidOperationException("JWT Secret is not configured.");

            var key = Encoding.UTF8.GetBytes(_options.JwtSecret);
            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: new[] { new Claim(ClaimTypes.Email, email) },
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
