using System;

namespace Symposium.DTO.PostDto
{
    public class PostLikedByDto
    {
        public Guid Id { get; set; }
        
        public Guid UserId { get; set; }
        
        public Guid PostId { get; set; }
        
        public DateTimeOffset LikedDate { get; set; }
    }
}
