
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Symposium.DTO.ProfileDto
{
    public class UploadProfileImageDto
    {
        [Required]
        public IFormFile ProfileImage { get; set; }
    }
}
