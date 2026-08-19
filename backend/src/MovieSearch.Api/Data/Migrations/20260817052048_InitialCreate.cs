using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MovieSearch.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:pg_trgm", ",,");

            migrationBuilder.CreateTable(
                name: "Actors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    ReleaseDate = table.Column<DateOnly>(type: "date", nullable: false),
                    GenreId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Movies_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MovieActors",
                columns: table => new
                {
                    MovieId = table.Column<int>(type: "integer", nullable: false),
                    ActorId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieActors", x => new { x.MovieId, x.ActorId });
                    table.ForeignKey(
                        name: "FK_MovieActors_Actors_ActorId",
                        column: x => x.ActorId,
                        principalTable: "Actors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieActors_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Actors",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Keanu Reeves" },
                    { 2, "Laurence Fishburne" },
                    { 3, "Carrie-Anne Moss" },
                    { 4, "Leonardo DiCaprio" },
                    { 5, "Joseph Gordon-Levitt" },
                    { 6, "Christian Bale" },
                    { 7, "Heath Ledger" },
                    { 8, "Morgan Freeman" },
                    { 9, "Tom Hanks" },
                    { 10, "Robin Wright" },
                    { 11, "Sigourney Weaver" },
                    { 12, "Tom Skerritt" },
                    { 13, "Amy Poehler" },
                    { 14, "Phyllis Smith" },
                    { 15, "Sandra Bullock" }
                });

            migrationBuilder.InsertData(
                table: "Genres",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Action" },
                    { 2, "Science Fiction" },
                    { 3, "Drama" },
                    { 4, "Animation" },
                    { 5, "Thriller" }
                });

            migrationBuilder.InsertData(
                table: "Movies",
                columns: new[] { "Id", "Description", "GenreId", "ReleaseDate", "Title" },
                values: new object[,]
                {
                    { 1, "A hacker discovers that reality is a simulation and joins a rebellion against its controllers.", 1, new DateOnly(1999, 3, 31), "The Matrix" },
                    { 2, "Neo and his allies race to protect Zion while uncovering new truths about the Matrix.", 1, new DateOnly(2003, 5, 15), "The Matrix Reloaded" },
                    { 3, "A skilled extractor is offered a chance to erase his past by planting an idea in a target's mind.", 2, new DateOnly(2010, 7, 16), "Inception" },
                    { 4, "Batman faces a criminal mastermind who pushes Gotham and its heroes toward chaos.", 1, new DateOnly(2008, 7, 18), "The Dark Knight" },
                    { 5, "A kindhearted man witnesses defining moments in American history while pursuing his childhood love.", 3, new DateOnly(1994, 7, 6), "Forrest Gump" },
                    { 6, "A deep-space crew encounters a lethal organism aboard its commercial starship.", 2, new DateOnly(1979, 5, 25), "Alien" },
                    { 7, "A retired assassin returns to the criminal underworld after a devastating personal loss.", 1, new DateOnly(2014, 10, 24), "John Wick" },
                    { 8, "The emotions inside a young girl's mind struggle to guide her through a major life change.", 4, new DateOnly(2015, 6, 19), "Inside Out" },
                    { 9, "A police officer must keep a city bus moving above a set speed to prevent a bomb from exploding.", 5, new DateOnly(1994, 6, 10), "Speed" }
                });

            migrationBuilder.InsertData(
                table: "MovieActors",
                columns: new[] { "ActorId", "MovieId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 1 },
                    { 3, 1 },
                    { 1, 2 },
                    { 2, 2 },
                    { 3, 2 },
                    { 4, 3 },
                    { 5, 3 },
                    { 6, 4 },
                    { 7, 4 },
                    { 8, 4 },
                    { 9, 5 },
                    { 10, 5 },
                    { 11, 6 },
                    { 12, 6 },
                    { 1, 7 },
                    { 13, 8 },
                    { 14, 8 },
                    { 1, 9 },
                    { 15, 9 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Actors_Name",
                table: "Actors",
                column: "Name")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });

            migrationBuilder.CreateIndex(
                name: "IX_Genres_Name",
                table: "Genres",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MovieActors_ActorId",
                table: "MovieActors",
                column: "ActorId");

            migrationBuilder.CreateIndex(
                name: "IX_Movies_GenreId",
                table: "Movies",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Movies_Title",
                table: "Movies",
                column: "Title")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieActors");

            migrationBuilder.DropTable(
                name: "Actors");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropTable(
                name: "Genres");
        }
    }
}
