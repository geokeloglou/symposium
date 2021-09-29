using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Symposium.Data.Database;
using Symposium.DTO.ProfileDto;
using Symposium.Services.EmailService;
using Symposium.Services.StorageService;
using Symposium.Services.Utilities;

namespace Symposium.Services.ProfileService
{
    public interface IProfileService
    {
        Task<ServiceResponse<string>> UploadProfileImage(UploadProfileImageDto postDto);
        Task<ServiceResponse<List<GetProfileInfoDto>>> GetProfileInfo();
    }
    
    public class ProfileService : IProfileService
    {
        private readonly SymposiumDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPgConnection _pgConnection;
        private readonly IStorageService _storageService;
        private readonly IMapper _mapper;

        public ProfileService(
            SymposiumDbContext context,
            IConfiguration configuration,
            IEmailSender emailSender, 
            IHttpContextAccessor httpContextAccessor,
            IPgConnection pgConnection,
            IStorageService storageService, 
            IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _emailSender = emailSender;
            _httpContextAccessor = httpContextAccessor;
            _pgConnection = pgConnection;
            _storageService = storageService;
            _mapper = mapper;
        }
        
        private Guid GetUserGuid() =>
            Guid.Parse(_httpContextAccessor.HttpContext.User
                .FindFirst(ClaimTypes.NameIdentifier).Value);
        
        public async Task<ServiceResponse<string>> UploadProfileImage(UploadProfileImageDto uploadProfileImageDto)
        {
            var response = new ServiceResponse<string>();
            var user = await _context.Users.FindAsync(GetUserGuid());
            if (user != null)
            {
                try
                {
                    string imageUrl = null;
                    if (uploadProfileImageDto.ProfileImage != null)
                    {
                        imageUrl = _configuration.GetSection("Storage:ImageUrl").Value + uploadProfileImageDto.ProfileImage.FileName;
                        await _storageService.UploadAsync(uploadProfileImageDto.ProfileImage);

                    }

                    user.ImageUrl = imageUrl;
                    await _context.SaveChangesAsync();
                
                    response.Message = "Profile image has been updated.";
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Data);
                    Console.WriteLine(e.Message);
                    Console.WriteLine(e.StackTrace);
                    response.Success = false;
                    response.Message = "Profile image has not been updated";
                }
            }
            else
            {
                response.Success = true;
                response.Message = "User has not found.";
            }

            return response;
        }

        public async Task<ServiceResponse<List<GetProfileInfoDto>>> GetProfileInfo()
        {
            var response = new ServiceResponse<List<GetProfileInfoDto>>();
            var users = await _context.Users.Where(user => user.Id == GetUserGuid()).ToListAsync();

            response.Data = _mapper.Map<List<GetProfileInfoDto>>(users);
            response.Message = "User's profile information.";

            return response;
        }
    }
}
