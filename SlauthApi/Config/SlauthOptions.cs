using System.Collections.Generic;

namespace SlauthApi.Config
{
    public class OAuthProviderOptions
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }

    public class SlauthOptions
    {
        public string MongoUri { get; set; }
        public string JwtSecret { get; set; }
        public Dictionary<string, OAuthProviderOptions> OAuthProviders { get; set; }
    }
}

