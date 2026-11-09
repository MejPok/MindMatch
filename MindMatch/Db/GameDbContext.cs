using Microsoft.EntityFrameworkCore;
using MindMatch.Models;

namespace MindMatch.Db
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options)
            : base(options)
        {

        }

        public DbSet<GameSession> GameSessions { get; set; }

        
    }
}
