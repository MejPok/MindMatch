using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMatch.Migrations
{
    /// <inheritdoc />
    public partial class calculatingScores : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "calculatedRoundIndex",
                table: "GameSessions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "calculatedRoundIndex",
                table: "GameSessions");
        }
    }
}
