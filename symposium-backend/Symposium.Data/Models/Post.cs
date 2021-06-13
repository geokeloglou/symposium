using System;
using System.ComponentModel.DataAnnotations;

namespace Symposium.Data.Models
{
    public class Post
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        public string Text { get; set; }
        
        [Required]
        public DateTimeOffset CreatedDate { get; set; }
        
        public DateTimeOffset? UpdatedDate { get; set; }
        
        [Required]
        public string Likes { get; set; }
        
        [Required]
        public bool Archived { get; set; }
        
        public string? ImageUrl { get; set; }
    }
}
