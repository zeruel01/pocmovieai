using Microsoft.Extensions.DependencyInjection;
using MovieSearch.Api.Contracts;
using MovieSearch.Api.IntegrationTests.Infrastructure;
using MovieSearch.Api.Services;

namespace MovieSearch.Api.IntegrationTests.Services;

[Collection(MovieSearchApiCollection.Name)]
public sealed class MovieServiceTests(MovieSearchApiFixture fixture)
{
    public static TheoryData<MovieSearchRequest, string[]> CriterionCombinations => new()
    {
        {
            new MovieSearchRequest { Title = "matrix" },
            ["The Matrix", "The Matrix Reloaded"]
        },
        {
            new MovieSearchRequest { Genre = "action" },
            ["John Wick", "The Dark Knight", "The Matrix", "The Matrix Reloaded"]
        },
        {
            new MovieSearchRequest { Actor = "keanu" },
            ["John Wick", "Speed", "The Matrix", "The Matrix Reloaded"]
        },
        {
            new MovieSearchRequest { Title = "matrix", Genre = "action" },
            ["The Matrix", "The Matrix Reloaded"]
        },
        {
            new MovieSearchRequest { Title = "matrix", Actor = "laurence" },
            ["The Matrix", "The Matrix Reloaded"]
        },
        {
            new MovieSearchRequest { Genre = "thriller", Actor = "keanu" },
            ["Speed"]
        },
        {
            new MovieSearchRequest { Title = "matrix", Genre = "action", Actor = "keanu" },
            ["The Matrix", "The Matrix Reloaded"]
        }
    };

    [Theory]
    [MemberData(nameof(CriterionCombinations))]
    public async Task SearchAsync_AppliesEveryProvidedCriterion(
        MovieSearchRequest request,
        string[] expectedTitles)
    {
        var movies = await SearchAsync(request);

        Assert.Equal(expectedTitles, movies.Select(movie => movie.Title));
    }

    [Fact]
    public async Task SearchAsync_WithEmptyCriteria_ReturnsAllMovies()
    {
        var request = new MovieSearchRequest
        {
            Title = "  ",
            Genre = "",
            Actor = null
        };

        var movies = await SearchAsync(request);

        Assert.Equal(9, movies.Count);
    }

    [Fact]
    public async Task SearchAsync_TrimsEveryProvidedCriterion()
    {
        var request = new MovieSearchRequest
        {
            Title = " matrix ",
            Genre = " action ",
            Actor = " keanu "
        };

        var movies = await SearchAsync(request);

        Assert.Equal(["The Matrix", "The Matrix Reloaded"], movies.Select(movie => movie.Title));
    }

    [Fact]
    public async Task SearchAsync_WithNoMatch_ReturnsEmptyCollection()
    {
        var movies = await SearchAsync(new MovieSearchRequest { Title = "not-a-seeded-movie" });

        Assert.Empty(movies);
    }

    [Theory]
    [InlineData("%")]
    [InlineData("_")]
    [InlineData("\\")]
    public async Task SearchAsync_TreatsSqlWildcardsAsLiteralCharacters(string value)
    {
        var movies = await SearchAsync(new MovieSearchRequest { Title = value });

        Assert.Empty(movies);
    }

    [Fact]
    public async Task SearchAsync_WithCancelledToken_CancelsDatabaseQuery()
    {
        await using var scope = fixture.Services.CreateAsyncScope();
        var movieService = scope.ServiceProvider.GetRequiredService<IMovieService>();
        using var cancellation = new CancellationTokenSource();
        await cancellation.CancelAsync();

        await Assert.ThrowsAnyAsync<OperationCanceledException>(() =>
            movieService.SearchAsync(new MovieSearchRequest(), cancellation.Token));
    }

    [Fact]
    public async Task GetByIdAsync_WithCancelledToken_CancelsDatabaseQuery()
    {
        await using var scope = fixture.Services.CreateAsyncScope();
        var movieService = scope.ServiceProvider.GetRequiredService<IMovieService>();
        using var cancellation = new CancellationTokenSource();
        await cancellation.CancelAsync();

        await Assert.ThrowsAnyAsync<OperationCanceledException>(() =>
            movieService.GetByIdAsync(1, cancellation.Token));
    }

    private async Task<IReadOnlyList<MovieSummaryDto>> SearchAsync(MovieSearchRequest request)
    {
        await using var scope = fixture.Services.CreateAsyncScope();
        var movieService = scope.ServiceProvider.GetRequiredService<IMovieService>();

        return await movieService.SearchAsync(request);
    }
}