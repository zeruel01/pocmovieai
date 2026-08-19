namespace MovieSearch.Api.Domain.Entities;

public sealed class Movie
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public DateOnly ReleaseDate { get; set; }

    public int GenreId { get; set; }

    public Genre Genre { get; set; } = null!;

    public ICollection<MovieActor> MovieActors { get; } = [];
}