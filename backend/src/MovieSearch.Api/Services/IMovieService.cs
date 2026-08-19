using MovieSearch.Api.Contracts;

namespace MovieSearch.Api.Services;

public interface IMovieService
{
    Task<IReadOnlyList<MovieSummaryDto>> SearchAsync(
        MovieSearchRequest request,
        CancellationToken cancellationToken = default);

    Task<MovieDetailsDto?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);
}