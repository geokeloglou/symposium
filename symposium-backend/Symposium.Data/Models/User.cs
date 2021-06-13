using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Symposium.Data.Models
{
    public class User
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        
        [Required]
        public string Username { get; set; }
        
        [Required]
        public string Firstname { get; set; }
        
        [Required]
        public string Lastname { get; set; }
        
        [Required, EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public byte[] PasswordHash { get; set; }
        
        [Required]
        public byte[] PasswordSalt { get; set; }
        
        [Required]
        public DateTimeOffset RegisteredDate { get; set; }
        
        public string? ResetPasswordToken { get; set; }
        
        public DateTimeOffset? ResetPasswordTokenDate { get; set; }
        
        public DateTimeOffset? LastLogin { get; set; }

        public string? Intro { get; set; }
        
        public string? ImageUrl { get; set; }
        
        [ForeignKey("UserId")]
        public ICollection<Post> Posts { get; set; }
    }
}
