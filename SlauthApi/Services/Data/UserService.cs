using MongoDB.Driver;
using SlauthApi.Models.Domain;
using SlauthApi.Config;

namespace SlauthApi.Services.Data
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(SlauthOptions options)
        {
            var client = new MongoClient(options.MongoUri);
            var database = client.GetDatabase("slauthkit");
            _users = database.GetCollection<User>("users");
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task CreateUser(User user)
        {
            await _users.InsertOneAsync(user);
        }
    }
}