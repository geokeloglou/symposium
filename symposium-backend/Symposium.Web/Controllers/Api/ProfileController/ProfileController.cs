using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Symposium.DTO.ProfileDto;
using Symposium.Services.ProfileService;

namespace Symposium.Web.Controllers.Api.ProfileController
{
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {

        private readonly IProfileService _profileService;

        public ProfileController(
            IProfileService profileService) 
        {
            _profileService = profileService;
        }
        
        [HttpPost("image/upload")]
        public async Task<IActionResult> UploadProfileImage([FromForm] UploadProfileImageDto uploadProfileImageDto)
        {
            var response = await _profileService.UploadProfileImage(uploadProfileImageDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        
        [HttpGet("info")]
        public async Task<IActionResult> GetProfileInfo()
        {
            var response = await _profileService.GetProfileInfo();
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

    }
}
