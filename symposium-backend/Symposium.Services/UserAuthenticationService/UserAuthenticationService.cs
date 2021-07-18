using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Symposium.Data.Database;
using Symposium.Data.Models;
using Symposium.DTO.AuthenticationDto;
using Symposium.Services.EmailService;
using Symposium.Services.Utilities;

namespace Symposium.Services.UserAuthenticationService
{
    public interface IUserAuthenticationService
    {
        Task<ServiceResponse<Guid>> Register(RegisterUserDto request);
        Task<ServiceResponse<string>> Login(LoginUserDto request);
        Task<ServiceResponse<string>> ForgotPassword(ForgotPasswordDto request);
        Task<ServiceResponse<string>> ResetPassword(ResetPasswordDto request);
    }

    public class UserAuthenticationService : IUserAuthenticationService
    {
        private readonly SymposiumDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;

        public UserAuthenticationService(
            SymposiumDbContext context,
            IConfiguration configuration,
            IEmailSender emailSender)
        {
            _context = context;
            _configuration = configuration;
            _emailSender = emailSender;
        }

        public async Task<ServiceResponse<Guid>> Register(RegisterUserDto user)
        {
            var response = new ServiceResponse<Guid>();
            if (!EmailUtils.IsValidEmail(user.Email))
            {
                response.Success = false;
                response.Message = "Email field is not valid email.";
                return response;
            }

            if (String.IsNullOrEmpty(user.Email) ||
                String.IsNullOrEmpty(user.Firstname) ||
                String.IsNullOrEmpty(user.Lastname))
            {
                response.Success = false;
                response.Message = "Fields cannot be null or empty.";
                return response;
            }

            if (String.IsNullOrWhiteSpace(user.Email) ||
                String.IsNullOrWhiteSpace(user.Firstname) ||
                String.IsNullOrWhiteSpace(user.Lastname))
            {
                response.Success = false;
                response.Message = "Fields cannot be null or whitespace.";
                return response;
            }

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                response.Success = false;
                response.Message = "Email exists.";
                return response;
            }

            var passwordChars = "!@#$%^&*".ToList();
            if (user.Password.Length < 8 ||
                !user.Password.Any(d => Char.IsLetter(d)) ||
                !user.Password.Any(d => Char.IsDigit(d)) ||
                !user.Password.Any(d => passwordChars.Contains(d)))
            {
                response.Success = false;
                response.Message = "Your password does not match the valid criteria " +
                                   "(>= 8 chars, one letter, one number and one (!@#$%^&*)!).";
                return response;
            }

            PasswordUtils.CreatePassHash(user.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var newUser = new User
            {
                Username = user.Username,
                Email = user.Email,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                RegisteredDate = DateTimeOffset.Now,
                Intro = user.Intro,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
            };

            await _context.Users
                .AddAsync(newUser);
            await _context
                .SaveChangesAsync();

            response.Data = newUser.Id;
            response.Message = "User has been registered successfully.";

            return response;
        }

        public async Task<ServiceResponse<string>> Login(LoginUserDto request)
        {
            var response = new ServiceResponse<string>();
            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email.ToLower().Equals(request.Email.ToLower()));
            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found.";
            }
            else if (!PasswordUtils.VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Incorrect credentials."; // Wrong password.
            }
            else
            {
                user.LastLogin = DateTimeOffset.Now;

                await _context.SaveChangesAsync();

                response.Data = CreateToken(user);
                response.Message = "Successfully logged in.";
            }

            return response;
        }

        public async Task<ServiceResponse<string>> ForgotPassword(ForgotPasswordDto request)
        {
            var response = new ServiceResponse<string>();
            var user = await _context.Users
                .Where(u => u.Email == request.Email)
                .FirstOrDefaultAsync();
            if (user == null)
            {
                response.Success = false;
                return response;
            }

            var token = StringUtils.RandomString(50);
            var baseUrl = _configuration.GetSection("General:BaseUrl").Value;
            var message = new Message(
                new[] {$"{user.Email}"},
                "Forgot password - Symposium",
                "Hello, <br><br>" +
                $"Press <a href={baseUrl}/reset-password?t={token}>here </a>" + "to reset your password. " +
                "Valid for only 20 minutes.<br><br>" +
                "If you did not forget your password, ignore this email.<br><br>" +
                "Symposium team");

            user.ResetPasswordToken = token;
            user.ResetPasswordTokenDate = DateTimeOffset.Now.AddMinutes(20);

            await _context.SaveChangesAsync();
            await _emailSender.SendEmailAsync(message);

            response.Message = "Please check email for information.";

            return response;
        }

        public async Task<ServiceResponse<string>> ResetPassword(ResetPasswordDto request)
        {
            var response = new ServiceResponse<string>();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.ResetPasswordToken.Equals(request.Token));

            if (user != null)
            {
                if (DateTimeOffset.Now > user.ResetPasswordTokenDate)
                {
                    response.Success = false;
                    response.Message = "Token has been expired.";

                    return response;
                }

                PasswordUtils.CreatePassHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.ResetPasswordToken = null;
                user.ResetPasswordTokenDate = null;

                await _context.SaveChangesAsync();

                response.Message = "New password has been set.";

                return response;
            }

            response.Message = "Not valid token.";
            response.Success = false;

            return response;
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration.GetSection("AuthSettings:Token").Value));

            SigningCredentials credentials = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha512Signature);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
