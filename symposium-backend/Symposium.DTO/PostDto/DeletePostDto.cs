using System;
using System.ComponentModel.DataAnnotations;

namespace Symposium.DTO.PostDto
{
    public class DeletePostDto
    {
        [Required]
        public Guid Id { get; set; }
    }
}
