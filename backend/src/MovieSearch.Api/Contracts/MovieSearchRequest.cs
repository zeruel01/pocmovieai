using System.ComponentModel.DataAnnotations;

namespace MovieSearch.Api.Contracts;

public sealed class MovieSearchRequest
{
    [StringLength(200)]
    public string? Title { get; init; }

    [StringLength(100)]
    public string? Genre { get; init; }

    [StringLength(200)]
    public string? Actor { get; init; }
}