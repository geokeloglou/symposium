using System;

namespace Symposium.DTO.PostDto
{
    public class GetAllPostsDto
    {
        public Guid UserId { get; set; }
        
        public string Email { get; set; }

        public string Username { get; set; }
        
        public string Firstname { get; set; }
        
        public string Lastname { get; set; }

        public string? UserImageUrl { get; set; }

        public Guid PostId { get; set; }
        
        public string Text { get; set; }
        
        public DateTimeOffset CreatedDate { get; set; }
        
        public DateTimeOffset? UpdatedDate { get; set; }
        
        public string Likes { get; set; }
        
        public bool Archived { get; set; }
        
        public string? PostImageUrl { get; set; }
    }
}
