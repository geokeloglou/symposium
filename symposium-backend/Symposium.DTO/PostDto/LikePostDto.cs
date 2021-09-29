using System;
using System.ComponentModel.DataAnnotations;

namespace Symposium.DTO.PostDto
{
    public class LikePostDto
    {
        [Required]
        public Guid Id { get; set; }
    }
}
