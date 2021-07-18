using System;

namespace Symposium.DTO.ProfileDto
{
    public class GetProfileInfoDto
    {
        public Guid Id { get; set; }
        
        public string Username { get; set; }
        
        public string Firstname { get; set; }
        
        public string Lastname { get; set; }
        
        public string Email { get; set; }

        public DateTimeOffset RegisteredDate { get; set; }

        public DateTimeOffset? LastLogin { get; set; }

        public string? Intro { get; set; }
        
        public string? ImageUrl { get; set; }
    }
}
