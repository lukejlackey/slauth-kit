using System.Collections.Generic;

namespace SlauthApi.Config
{
    public class SlauthOptions
    {
        public string MongoUri { get; set; } = null!;
        public string JwtSecret { get; set; } = null!;
        public Dictionary<string, OAuthProviderOptions> OAuthProviders { get; set; } = new();
    }

    public class OAuthProviderOptions
    {
        public string ClientId { get; set; } = null!;
        public string ClientSecret { get; set; } = null!;
        public string AuthorizationEndpoint { get; set; } = null!;
        public string TokenEndpoint { get; set; } = null!;
        public string UserInfoEndpoint { get; set; } = null!;
        public string[]? Scopes { get; set; }
        public string RedirectUri { get; set; } = null!;
    }

}

