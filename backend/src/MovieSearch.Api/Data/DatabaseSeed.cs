using MovieSearch.Api.Domain.Entities;

namespace MovieSearch.Api.Data;

internal static class DatabaseSeed
{
    internal static readonly Genre[] Genres =
    [
        new() { Id = 1, Name = "Action" },
        new() { Id = 2, Name = "Science Fiction" },
        new() { Id = 3, Name = "Drama" },
        new() { Id = 4, Name = "Animation" },
        new() { Id = 5, Name = "Thriller" }
    ];

    internal static readonly Actor[] Actors =
    [
        new() { Id = 1, Name = "Keanu Reeves" },
        new() { Id = 2, Name = "Laurence Fishburne" },
        new() { Id = 3, Name = "Carrie-Anne Moss" },
        new() { Id = 4, Name = "Leonardo DiCaprio" },
        new() { Id = 5, Name = "Joseph Gordon-Levitt" },
        new() { Id = 6, Name = "Christian Bale" },
        new() { Id = 7, Name = "Heath Ledger" },
        new() { Id = 8, Name = "Morgan Freeman" },
        new() { Id = 9, Name = "Tom Hanks" },
        new() { Id = 10, Name = "Robin Wright" },
        new() { Id = 11, Name = "Sigourney Weaver" },
        new() { Id = 12, Name = "Tom Skerritt" },
        new() { Id = 13, Name = "Amy Poehler" },
        new() { Id = 14, Name = "Phyllis Smith" },
        new() { Id = 15, Name = "Sandra Bullock" }
    ];

    internal static readonly Movie[] Movies =
    [
        new()
        {
            Id = 1,
            Title = "The Matrix",
            Description = "A hacker discovers that reality is a simulation and joins a rebellion against its controllers.",
            ReleaseDate = new DateOnly(1999, 3, 31),
            GenreId = 1
        },
        new()
        {
            Id = 2,
            Title = "The Matrix Reloaded",
            Description = "Neo and his allies race to protect Zion while uncovering new truths about the Matrix.",
            ReleaseDate = new DateOnly(2003, 5, 15),
            GenreId = 1
        },
        new()
        {
            Id = 3,
            Title = "Inception",
            Description = "A skilled extractor is offered a chance to erase his past by planting an idea in a target's mind.",
            ReleaseDate = new DateOnly(2010, 7, 16),
            GenreId = 2
        },
        new()
        {
            Id = 4,
            Title = "The Dark Knight",
            Description = "Batman faces a criminal mastermind who pushes Gotham and its heroes toward chaos.",
            ReleaseDate = new DateOnly(2008, 7, 18),
            GenreId = 1
        },
        new()
        {
            Id = 5,
            Title = "Forrest Gump",
            Description = "A kindhearted man witnesses defining moments in American history while pursuing his childhood love.",
            ReleaseDate = new DateOnly(1994, 7, 6),
            GenreId = 3
        },
        new()
        {
            Id = 6,
            Title = "Alien",
            Description = "A deep-space crew encounters a lethal organism aboard its commercial starship.",
            ReleaseDate = new DateOnly(1979, 5, 25),
            GenreId = 2
        },
        new()
        {
            Id = 7,
            Title = "John Wick",
            Description = "A retired assassin returns to the criminal underworld after a devastating personal loss.",
            ReleaseDate = new DateOnly(2014, 10, 24),
            GenreId = 1
        },
        new()
        {
            Id = 8,
            Title = "Inside Out",
            Description = "The emotions inside a young girl's mind struggle to guide her through a major life change.",
            ReleaseDate = new DateOnly(2015, 6, 19),
            GenreId = 4
        },
        new()
        {
            Id = 9,
            Title = "Speed",
            Description = "A police officer must keep a city bus moving above a set speed to prevent a bomb from exploding.",
            ReleaseDate = new DateOnly(1994, 6, 10),
            GenreId = 5
        }
    ];

    internal static readonly MovieActor[] MovieActors =
    [
        new() { MovieId = 1, ActorId = 1 },
        new() { MovieId = 1, ActorId = 2 },
        new() { MovieId = 1, ActorId = 3 },
        new() { MovieId = 2, ActorId = 1 },
        new() { MovieId = 2, ActorId = 2 },
        new() { MovieId = 2, ActorId = 3 },
        new() { MovieId = 3, ActorId = 4 },
        new() { MovieId = 3, ActorId = 5 },
        new() { MovieId = 4, ActorId = 6 },
        new() { MovieId = 4, ActorId = 7 },
        new() { MovieId = 4, ActorId = 8 },
        new() { MovieId = 5, ActorId = 9 },
        new() { MovieId = 5, ActorId = 10 },
        new() { MovieId = 6, ActorId = 11 },
        new() { MovieId = 6, ActorId = 12 },
        new() { MovieId = 7, ActorId = 1 },
        new() { MovieId = 8, ActorId = 13 },
        new() { MovieId = 8, ActorId = 14 },
        new() { MovieId = 9, ActorId = 1 },
        new() { MovieId = 9, ActorId = 15 }
    ];
}