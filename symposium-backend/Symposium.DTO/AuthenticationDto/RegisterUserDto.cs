using System.ComponentModel.DataAnnotations;

namespace Symposium.DTO.AuthenticationDto
{
    public class RegisterUserDto
    {
        [Required]
        public string Firstname { get; set; }
        
        [Required]
        public string Lastname { get; set; }
        
        [Required, EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        public string? Intro { get; set; }
    }
}
