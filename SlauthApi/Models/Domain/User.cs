using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SlauthApi.Models.Domain
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        // Optional OAuth fields
        [BsonElement("provider")]
        public string? Provider { get; set; }

        [BsonElement("providerId")]
        public string? ProviderId { get; set; }
    }
}
