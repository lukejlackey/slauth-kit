using MongoDB.Driver;
using SlauthApi.Models.Domain;
using SlauthApi.Config;
using System.Collections.Generic;
using System.Linq;

namespace SlauthApi.Services.Integration
{
    public class OAuthService
    {
        private readonly IMongoCollection<User> _users;
        private readonly Dictionary<string, OAuthProviderOptions> _secrets;

        public OAuthService(SlauthOptions options)
        {
            _secrets = options.OAuthProviders ?? new Dictionary<string, OAuthProviderOptions>();
            var client = new MongoClient(options.MongoUri);
            var database = client.GetDatabase("slauthkit");
            _users = database.GetCollection<User>("users");
        }

        public async Task<User> GetUserByProvider(string provider, string providerId)
        {
            return await _users.Find(u => u.Provider == provider && u.ProviderId == providerId)
                               .FirstOrDefaultAsync();
        }

        public async Task<User> CreateOAuthUser(string email, string provider, string providerId)
        {
            var user = new User
            {
                Email = email,
                Provider = provider,
                ProviderId = providerId
            };
            await _users.InsertOneAsync(user);
            return user;
        }

        /// <summary>
        /// Exchange the OAuth code for a user (or create one) and return whatever you want the controller to send back.
        /// TODO: wire up the real provider‐specific logic here.
        /// </summary>
        public async Task<object> HandleOAuthCallback(string provider, string code)
        {
            // Example stub:
            // 1. Exchange `code` for an access_token
            // 2. Fetch the user’s profile/email
            // 3. Lookup or create a local User via GetUserByProvider/CreateOAuthUser
            // 4. Generate and return a JWT or user object

            throw new NotImplementedException("OAuth callback handling not implemented yet.");
        }
    }
}
