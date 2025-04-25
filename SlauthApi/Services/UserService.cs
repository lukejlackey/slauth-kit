using MongoDB.Driver;
using SlauthApi.Models;
using Microsoft.Extensions.Configuration;

namespace SlauthApi.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IConfiguration config)
        {
            var client = new MongoClient(config["MONGO_URI"]);
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
