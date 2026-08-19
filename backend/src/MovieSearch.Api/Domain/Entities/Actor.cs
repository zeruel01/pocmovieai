namespace MovieSearch.Api.Domain.Entities;

public sealed class Actor
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public ICollection<MovieActor> MovieActors { get; } = [];
}