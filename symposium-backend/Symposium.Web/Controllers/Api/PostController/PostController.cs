using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Symposium.DTO.PostDto;
using Symposium.Services.PostService;

namespace Symposium.Web.Controllers.Api.PostController
{
    [ApiController]
    [Route("api/post")]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostController(
            IPostService postService)
        {
            _postService = postService;
        }
        
        [HttpPost("create"), 
         Consumes("multipart/form-data"), 
         RequestFormLimits(MultipartBodyLengthLimit = 20000000), 
         RequestSizeLimit(20000000)]
        public async Task<IActionResult> Create([FromForm] CreatePostDto createPostDto)
        {
            var response = await _postService.CreatePost(createPostDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        
        [HttpPost("delete")]
        public async Task<IActionResult> Delete(DeletePostDto deletePostDto)
        {
            var response = await _postService.DeletePost(deletePostDto);
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        
        [HttpGet("get")]
        public async Task<IActionResult> Get()
        {
            var response = await _postService.GetPosts();
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _postService.GetAllPosts();
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        
        [HttpPost("like")]
        public async Task<IActionResult> Like(LikePostDto likePostDto)
        {
            var response = await _postService.LikePost(likePostDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        
        [HttpGet("liked/get-all")]
        public async Task<IActionResult> GetAllLiked()
        {
            var response = await _postService.GetAllLikedPosts();
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
    }
}
