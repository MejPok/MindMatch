using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMatch.Migrations
{
    /// <inheritdoc />
    public partial class meow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.DropIndex(
                name: "IX_GameSessions_sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.DropColumn(
                name: "sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.AddColumn<string>(
                name: "sessionOwnerToken",
                table: "GameSessions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "sessionOwnerToken",
                table: "GameSessions");

            migrationBuilder.AddColumn<int>(
                name: "sessionOwnerId",
                table: "GameSessions",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_sessionOwnerId",
                table: "GameSessions",
                column: "sessionOwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions",
                column: "sessionOwnerId",
                principalTable: "Player",
                principalColumn: "Id");
        }
    }
}
