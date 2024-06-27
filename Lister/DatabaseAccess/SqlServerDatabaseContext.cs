using Lister.Models;
using Microsoft.EntityFrameworkCore;

namespace Lister.DatabaseAccess
{
    public class SqlServerDatabaseContext : DbContext
    {
        public SqlServerDatabaseContext(DbContextOptions<SqlServerDatabaseContext> options): base(options)
        {
        }

        public DbSet<WorkItem>? WorkItems { get; set; } = null;
        public DbSet<Client>? Clients { get; set; } = null;
    }
}
