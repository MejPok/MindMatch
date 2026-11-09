using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMatch.Migrations
{
    /// <inheritdoc />
    public partial class changeDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "amountOfPlayers",
                table: "GameSessions",
                newName: "sessionStarted");

            migrationBuilder.AddColumn<int>(
                name: "state",
                table: "Round",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AnswerId",
                table: "Player",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "answeredThisRound",
                table: "Player",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "playerToken",
                table: "Player",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "sessionId",
                table: "Player",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "currentRoundIndex",
                table: "GameSessions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "sessionOwnerId",
                table: "GameSessions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Answer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    submittedAnswer = table.Column<string>(type: "TEXT", nullable: false),
                    roundId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Answer_Round_roundId",
                        column: x => x.roundId,
                        principalTable: "Round",
                        principalColumn: "roundId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Player_AnswerId",
                table: "Player",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_sessionOwnerId",
                table: "GameSessions",
                column: "sessionOwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Answer_roundId",
                table: "Answer",
                column: "roundId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions",
                column: "sessionOwnerId",
                principalTable: "Player",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Player_Answer_AnswerId",
                table: "Player",
                column: "AnswerId",
                principalTable: "Answer",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Player_Answer_AnswerId",
                table: "Player");

            migrationBuilder.DropTable(
                name: "Answer");

            migrationBuilder.DropIndex(
                name: "IX_Player_AnswerId",
                table: "Player");

            migrationBuilder.DropIndex(
                name: "IX_GameSessions_sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.DropColumn(
                name: "state",
                table: "Round");

            migrationBuilder.DropColumn(
                name: "AnswerId",
                table: "Player");

            migrationBuilder.DropColumn(
                name: "answeredThisRound",
                table: "Player");

            migrationBuilder.DropColumn(
                name: "playerToken",
                table: "Player");

            migrationBuilder.DropColumn(
                name: "sessionId",
                table: "Player");

            migrationBuilder.DropColumn(
                name: "currentRoundIndex",
                table: "GameSessions");

            migrationBuilder.DropColumn(
                name: "sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.RenameColumn(
                name: "sessionStarted",
                table: "GameSessions",
                newName: "amountOfPlayers");
        }
    }
}
