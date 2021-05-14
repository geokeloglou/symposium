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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("User");
        }
    }
}
