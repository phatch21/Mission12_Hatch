using Microsoft.EntityFrameworkCore;
using Mission11_API.Models; // Ensure this is here

namespace Mission11_API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; }
    }
}
