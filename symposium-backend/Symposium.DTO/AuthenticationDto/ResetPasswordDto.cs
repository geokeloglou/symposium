using System.ComponentModel.DataAnnotations;

namespace Symposium.DTO.AuthenticationDto
{
    public class ResetPasswordDto
    {
        [Required]
        public string Password { get; set; }
        
        [Required]
        public string Token { get; set; }
    }
}
