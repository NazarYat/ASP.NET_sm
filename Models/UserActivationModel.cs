using System;

namespace ASP.NET_sm.Models
{
    public class UserActivationModel
    {
        public string Id { get; set; }
        public DateTime Time { get; set; }
        public TimeSpan DeltaTime { get; set; }
    }
}