using Microsoft.EntityFrameworkCore;
using MovieSearch.Api.Contracts;
using MovieSearch.Api.Data;
using MovieSearch.Api.Domain.Entities;

namespace MovieSearch.Api.Services;

public sealed class MovieService(MovieDbContext dbContext) : IMovieService
{
    public async Task<IReadOnlyList<MovieSummaryDto>> SearchAsync(
        MovieSearchRequest request,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Movie> query = dbContext.Movies.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            var titlePattern = CreateContainsPattern(request.Title);
            query = query.Where(movie => EF.Functions.ILike(movie.Title, titlePattern, "\\"));
        }

        if (!string.IsNullOrWhiteSpace(request.Genre))
        {
            var genrePattern = CreateContainsPattern(request.Genre);
            query = query.Where(movie => EF.Functions.ILike(movie.Genre.Name, genrePattern, "\\"));
        }

        if (!string.IsNullOrWhiteSpace(request.Actor))
        {
            var actorPattern = CreateContainsPattern(request.Actor);
            query = query.Where(movie => movie.MovieActors.Any(movieActor =>
                EF.Functions.ILike(movieActor.Actor.Name, actorPattern, "\\")));
        }

        return await query
            .OrderBy(movie => movie.Title)
            .ThenBy(movie => movie.ReleaseDate)
            .Select(movie => new MovieSummaryDto(
                movie.Id,
                movie.Title,
                movie.Genre.Name,
                movie.ReleaseDate))
            .ToListAsync(cancellationToken);
    }

    public Task<MovieDetailsDto?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return dbContext.Movies
            .AsNoTracking()
            .Where(movie => movie.Id == id)
            .Select(movie => new MovieDetailsDto(
                movie.Id,
                movie.Title,
                movie.Genre.Name,
                movie.Description,
                movie.ReleaseDate,
                movie.MovieActors
                    .OrderBy(movieActor => movieActor.Actor.Name)
                    .Select(movieActor => new ActorDto(
                        movieActor.Actor.Id,
                        movieActor.Actor.Name))
                    .ToArray()))
            .SingleOrDefaultAsync(cancellationToken);
    }

    private static string CreateContainsPattern(string value)
    {
        var escapedValue = value.Trim()
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace("%", "\\%", StringComparison.Ordinal)
            .Replace("_", "\\_", StringComparison.Ordinal);

        return $"%{escapedValue}%";
    }
}