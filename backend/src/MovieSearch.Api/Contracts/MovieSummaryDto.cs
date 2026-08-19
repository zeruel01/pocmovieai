namespace MovieSearch.Api.Contracts;

public sealed record MovieSummaryDto(
    int Id,
    string Title,
    string Genre,
    DateOnly ReleaseDate);