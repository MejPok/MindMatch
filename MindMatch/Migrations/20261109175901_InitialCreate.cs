using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMatch.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameSessions",
                columns: table => new
                {
                    gameSessionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    amountOfPlayers = table.Column<int>(type: "INTEGER", nullable: false),
                    maxAmountOfPlayers = table.Column<int>(type: "INTEGER", nullable: false),
                    joinCode = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameSessions", x => x.gameSessionId);
                });

            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    playerName = table.Column<string>(type: "TEXT", nullable: false),
                    score = table.Column<int>(type: "INTEGER", nullable: false),
                    gameSessionId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Player_GameSessions_gameSessionId",
                        column: x => x.gameSessionId,
                        principalTable: "GameSessions",
                        principalColumn: "gameSessionId");
                });

            migrationBuilder.CreateTable(
                name: "Round",
                columns: table => new
                {
                    roundId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    gameSessionId = table.Column<int>(type: "INTEGER", nullable: false),
                    playersAnswered = table.Column<int>(type: "INTEGER", nullable: false),
                    roundQuestion = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Round", x => x.roundId);
                    table.ForeignKey(
                        name: "FK_Round_GameSessions_gameSessionId",
                        column: x => x.gameSessionId,
                        principalTable: "GameSessions",
                        principalColumn: "gameSessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Player_gameSessionId",
                table: "Player",
                column: "gameSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Round_gameSessionId",
                table: "Round",
                column: "gameSessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Player");

            migrationBuilder.DropTable(
                name: "Round");

            migrationBuilder.DropTable(
                name: "GameSessions");
        }
    }
}
