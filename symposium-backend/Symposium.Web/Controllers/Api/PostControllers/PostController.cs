using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Symposium.DTO.PostDto;
using Symposium.Services.PostService;

namespace Symposium.Web.Controllers.Api.PostControllers
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
        
        [HttpPost("create")]
        public async Task<IActionResult> CreatePost(CreatePostDto post)
        {
            var response = await _postService.CreatePost(post);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        
        [HttpPost("delete")]
        public async Task<IActionResult> DeletePost(DeletePostDto deletePostDto)
        {
            var response = await _postService.DeletePost(deletePostDto);
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        
        [HttpGet("get")]
        public async Task<IActionResult> GetPosts()
        {
            var response = await _postService.GetPosts();
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllPosts()
        {
            var response = await _postService.GetAllPosts();
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        
        [HttpPost("like")]
        public async Task<IActionResult> LikePost(LikePostDto likePostDto)
        {
            var response = await _postService.LikePost(likePostDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        
        [HttpGet("liked/get-all")]
        public async Task<IActionResult> GetAllLikedPosts()
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
