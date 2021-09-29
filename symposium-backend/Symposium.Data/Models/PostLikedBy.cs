using System;
using System.ComponentModel.DataAnnotations;

namespace Symposium.Data.Models
{
    public class PostLikedBy
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        public Guid PostId { get; set; }
        
        [Required]
        public DateTimeOffset LikedDate { get; set; }
    }
}
