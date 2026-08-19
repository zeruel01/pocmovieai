namespace MovieSearch.Api.Contracts;

public sealed record MovieDetailsDto(
    int Id,
    string Title,
    string Genre,
    string Description,
    DateOnly ReleaseDate,
    ActorDto[] Actors);

public sealed record ActorDto(int Id, string Name);