using System.Collections.Generic;

public class SymposiumDbContext : DbContext
{
    public SymposiumDbContext(DbContextOptions<SymposiumDbContext> options) : base(options) {}

}