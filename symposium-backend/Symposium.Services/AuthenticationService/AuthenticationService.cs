using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Symposium.Data.Database;
using Symposium.Data.Models;
using Symposium.DTO.AuthenticationDto;
using Symposium.Services.Utilities;

namespace Symposium.Services.AuthenticationService
{
    public interface IUserAuthenticationService
    {
        Task<ServiceResponse<Guid>> Register(RegisterUserDto request);
        Task<ServiceResponse<string>> Login(LoginUserDto request);
    }

    public class UserAuthenticationService : IUserAuthenticationService
    {
        private readonly SymposiumDbContext _context;
        private readonly IConfiguration _configuration;

        public UserAuthenticationService(
            SymposiumDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                response.Message = "Your password does not match the valid criteria" +
                                   "(>= 8 chars, one letter, one number & one (!@#$%^&*)!).";
                return response;
            }

            CreatePassHash(user.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var newUser = new User
            {
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
            response.Message = "A user has been registered.";

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
            else if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
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

        private void CreatePassHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != passwordHash[i])
                {
                    return false;
                }
            }

            return true;
        }

        private string RandomString(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];

                while (length-- > 0)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(valid[(int) (num % (uint) valid.Length)]);
                }
            }

            return res.ToString();
        }
    }
}
