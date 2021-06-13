using Microsoft.EntityFrameworkCore;
using Symposium.Data.Models;

namespace Symposium.Data.Database
{
    public class SymposiumDbContext : DbContext
    {
        public SymposiumDbContext(DbContextOptions<SymposiumDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<User>()
                .ToTable("User");
            
            modelBuilder
                .Entity<Post>()
                .ToTable("Post");
            modelBuilder
                .Entity<Post>()
                .Property(p => p.Likes)
                .HasDefaultValue(0);
            modelBuilder
                .Entity<Post>()
                .Property(p => p.Archived)
                .HasDefaultValue(false);
        }
    }
}
