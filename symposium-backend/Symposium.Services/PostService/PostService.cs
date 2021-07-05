using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Symposium.Data.Database;
using Symposium.Data.Models;
using Symposium.DTO.PostDto;
using Symposium.Services.EmailService;
using Symposium.Services.Utilities;

namespace Symposium.Services.PostService
{
    public interface IPostService
    { 
        Task<ServiceResponse<Guid>> CreatePost(CreatePostDto postDto);
        Task<ServiceResponse<List<Post>>> GetPosts();
        Task<ServiceResponse<List<GetAllPostsDto>>> GetAllPosts();
        Task<ServiceResponse<Guid>> LikePost(LikePostDto postId);
        Task<ServiceResponse<List<PostLikedBy>>> GetAllLikedPosts();
    }
    
    public class PostService : IPostService
    {
        private readonly SymposiumDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPgConnection _pgConnection;

        public PostService(
            SymposiumDbContext context,
            IConfiguration configuration,
            IEmailSender emailSender, 
            IHttpContextAccessor httpContextAccessor,
            IPgConnection pgConnection)
        {
            _context = context;
            _configuration = configuration;
            _emailSender = emailSender;
            _httpContextAccessor = httpContextAccessor;
            _pgConnection = pgConnection;
        }
        
        private Guid GetUserGuid() =>
            Guid.Parse(_httpContextAccessor.HttpContext.User
                .FindFirst(ClaimTypes.NameIdentifier).Value);
        
        public async Task<ServiceResponse<Guid>> CreatePost(CreatePostDto postDto)
        {
            var response = new ServiceResponse<Guid>();
            var post = new Post
            {
                Text = postDto.Text,
                ImageUrl = postDto.ImageUrl,
                CreatedDate = DateTimeOffset.Now,
                UserId = GetUserGuid()
            };
            
            await _context.Posts.AddAsync(post);
            await _context.SaveChangesAsync();
            
            response.Data = post.Id;
            response.Message = "Post has been created.";

            return response;
        }
        
        public async Task<ServiceResponse<List<Post>>> GetPosts()
        {
            var response = new ServiceResponse<List<Post>>();
            var posts = await _context.Posts
                .Where(p => p.UserId == GetUserGuid())
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            response.Data = posts;
            response.Message = "All user posts.";
            
            return response;
        }
        
        public async Task<ServiceResponse<List<GetAllPostsDto>>> GetAllPosts()
        {
            var response = new ServiceResponse<List<GetAllPostsDto>>();
            var posts = await _pgConnection.GetConnection()
                .QueryAsync<GetAllPostsDto>($@"
                    SELECT 
                        u.""Id"" as userId, 
                        u.""Email"", 
                        u.""Username"", 
                        u.""Firstname"", 
                        u.""Lastname"", 
                        u.""ImageUrl"" as userImageUrl,
                        p.""Id"" as PostId, 
                        p.""Text"", 
                        p.""CreatedDate"",
                        p.""UpdatedDate"",
                        p.""Likes"",
                        p.""Archived"",
                        p.""ImageUrl"" as postImageUrl
                    FROM ""User"" u
                    INNER JOIN ""Post"" p
                    ON u.""Id"" = p.""UserId""
                    ORDER BY p.""CreatedDate"" DESC;");

            response.Data = new List<GetAllPostsDto>(posts);
            response.Message = "All posts.";
            
            return response;
        }

        public async Task<ServiceResponse<Guid>> LikePost(LikePostDto likePostDto)
        {
            var response = new ServiceResponse<Guid>();
            {
                var userGuid = GetUserGuid();
                var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == likePostDto.Id);
                var likedPostByUser = await _context.PostsLikedBy.FirstOrDefaultAsync(psb =>
                    psb.UserId == userGuid && 
                    psb.PostId == likePostDto.Id);

                if (likedPostByUser == null)
                {
                    var postLikedBy = new PostLikedBy
                    {
                        UserId = userGuid,
                        PostId = likePostDto.Id,
                        LikedDate = DateTimeOffset.Now
                    };
                
                    post.Likes += 1;
                    _context.PostsLikedBy.Add(postLikedBy);

                    response.Data = likePostDto.Id;
                    response.Message = "Post has been liked.";
                }
                else
                {
                    post.Likes -= 1;
                    _context.PostsLikedBy.Remove(likedPostByUser);

                    response.Data = likePostDto.Id;
                    response.Message = "Post has been unliked.";
                }
            }

            await _context.SaveChangesAsync();
            return response;
        }

        public async Task<ServiceResponse<List<PostLikedBy>>> GetAllLikedPosts()
        {
            var response = new ServiceResponse<List<PostLikedBy>>();
            var likedPosts = await _context.PostsLikedBy
                .Where(glb => glb.UserId == GetUserGuid())
                .ToListAsync();

            response.Data = likedPosts;
            response.Message = "All liked posts.";
            
            return response;
        }
    }
}
