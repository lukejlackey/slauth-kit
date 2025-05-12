using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SlauthApi.Models.Domain;
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("password")]
        [BsonIgnoreIfNull]
        public string? Password { get; set; }  // Optional for OAuth users

        [BsonElement("provider")]
        [BsonIgnoreIfNull]
        public string? Provider { get; set; }  // e.g., "google", "github"

        [BsonElement("providerId")]
        [BsonIgnoreIfNull]
        public string? ProviderId { get; set; }  // e.g., Google/GitHub user ID
    }
}
