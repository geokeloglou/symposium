using System.ComponentModel.DataAnnotations;

namespace Symposium.DTO.AuthenticationDto
{
    public class LoginUserDto
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
    }
}
