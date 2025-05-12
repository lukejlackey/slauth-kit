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
    }
}
