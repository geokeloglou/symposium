using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Symposium.DTO.AuthenticationDto;
using Symposium.Services.UserAuthenticationService;

namespace Symposium.Web.Controllers.Api.AuthenticationControllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserAuthenticationService _userAuthenticationService;

        public AuthenticationController(
            IUserAuthenticationService userAuthenticationService)
        {
            _userAuthenticationService = userAuthenticationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto user)
        {
            var response = await _userAuthenticationService.Register(user);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto request)
        {
            var response = await _userAuthenticationService.Login(request);
            if (!response.Success)
            {
                return BadRequest(response);
            }
        
            return Ok(response);
        }
        
        [HttpPost("forgot")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto request)
        {
            var response = await _userAuthenticationService.ForgotPassword(request);
            if (!response.Success)
            {
                return BadRequest(response);
            }
        
            return Ok(response);
        }
        
        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto request)
        {
            var response = await _userAuthenticationService.ResetPassword(request);
            if (!response.Success)
            {
                return BadRequest(response);
            }
        
            return Ok(response);
        }
    }
}
