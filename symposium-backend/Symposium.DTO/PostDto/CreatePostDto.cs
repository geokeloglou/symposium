using System;
using System.ComponentModel.DataAnnotations;

namespace Symposium.DTO.PostDto
{
    public class CreatePostDto
    {
        [Required]
        public string Text { get; set; }
        
        public DateTimeOffset CreatedDate { get; set; }
        
        public DateTimeOffset? UpdatedDate { get; set; }
        
        public string Likes { get; set; }
        
        public bool Archived { get; set; }
        
        public string? ImageUrl { get; set; }
    }
}
