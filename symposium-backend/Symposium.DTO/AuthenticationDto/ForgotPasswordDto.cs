using System.ComponentModel.DataAnnotations;

namespace Symposium.DTO.AuthenticationDto
{
    public class ForgotPasswordDto
    {
        [Required]
        public string Email { get; set; }
    }
}
