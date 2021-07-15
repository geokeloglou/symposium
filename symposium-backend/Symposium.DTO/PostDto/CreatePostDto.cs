using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Symposium.DTO.PostDto
{
    public class CreatePostDto
    {
        [Required]
        public string Text { get; set; }
        
        public DateTimeOffset CreatedDate { get; set; }
        
        public DateTimeOffset? UpdatedDate { get; set; }
        
        public int Likes { get; set; }
        
        public bool Archived { get; set; }
        
        public IFormFile? PostImage { get; set; }
    }
}
