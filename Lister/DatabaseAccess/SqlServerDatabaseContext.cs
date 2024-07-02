using Lister.Models;
using Microsoft.EntityFrameworkCore;

public class SqlServerDatabaseContext : DbContext
{
    public SqlServerDatabaseContext(DbContextOptions<SqlServerDatabaseContext> options)
        : base(options)
    {
    }

    public DbSet<Client> Clients { get; set; }
    public DbSet<WorkItem> WorkItems { get; set; }
}