using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMatch.Migrations
{
    /// <inheritdoc />
    public partial class changeDbFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.AlterColumn<int>(
                name: "sessionOwnerId",
                table: "GameSessions",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions",
                column: "sessionOwnerId",
                principalTable: "Player",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions");

            migrationBuilder.AlterColumn<int>(
                name: "sessionOwnerId",
                table: "GameSessions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Player_sessionOwnerId",
                table: "GameSessions",
                column: "sessionOwnerId",
                principalTable: "Player",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
