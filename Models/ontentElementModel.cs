using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace ASP.NET_sm.Models
{
    public class ContentElementModel
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Reference { get; set; }
        public string Description { get; set; }
        public bool ShowForUser { get; set; }
        public bool ShowForGuest { get; set; }

        public bool HasImage()
        {
            return !string.IsNullOrEmpty( this.Image );
        }
    }
}