using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public int Likes { get; set; }
        
        [Required]
        public bool Archived { get; set; }
        
        public string? ImageUrl { get; set; }
        
        [ForeignKey("PostId")]
        public ICollection<PostLikedBy> PostLikes { get; set; }
    }
}
