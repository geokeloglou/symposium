using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

public class SymposiumDbContext : DbContext
{
    public SymposiumDbContext(DbContextOptions<SymposiumDbContext> options) : base(options) {}

}