using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SlauthApi.Services.Data;
using SlauthApi.Services.Integration;
using SlauthApi.Config;

var builder = WebApplication.CreateBuilder(args);

// Load config
builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Bind strongly-typed settings
builder.Services.Configure<SlauthOptions>(builder.Configuration.GetSection("Slauth"));
// Make SlauthOptions injectable directly
builder.Services.AddSingleton(sp => sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<SlauthOptions>>().Value);

// Register services
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<OAuthService>();

builder.Services.AddControllers();

// JWT auth remains the same
var options = builder.Services.BuildServiceProvider().GetRequiredService<SlauthOptions>();
var key = Encoding.UTF8.GetBytes(options.JwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.RequireHttpsMetadata = false;
        opts.SaveToken = true;
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

var app = builder.Build();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => "Slauth is alive!");
app.Run();