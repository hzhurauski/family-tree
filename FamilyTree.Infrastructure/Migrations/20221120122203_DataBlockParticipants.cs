using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FamilyTree.Infrastructure.Migrations
{
    public partial class DataBlockParticipants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PersonToDataBlocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PersonId = table.Column<int>(nullable: false),
                    DataBlockId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonToDataBlocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonToDataBlocks_DataBlock_DataBlockId",
                        column: x => x.DataBlockId,
                        principalTable: "DataBlock",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_PersonToDataBlocks_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PersonToDataBlocks_DataBlockId",
                table: "PersonToDataBlocks",
                column: "DataBlockId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonToDataBlocks_PersonId",
                table: "PersonToDataBlocks",
                column: "PersonId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PersonToDataBlocks");
        }
    }
}
