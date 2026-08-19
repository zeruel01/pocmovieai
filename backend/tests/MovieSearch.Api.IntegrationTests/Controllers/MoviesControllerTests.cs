using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieSearch.Api.Contracts;
using MovieSearch.Api.IntegrationTests.Infrastructure;

namespace MovieSearch.Api.IntegrationTests.Controllers;

[Collection(MovieSearchApiCollection.Name)]
public sealed class MoviesControllerTests(MovieSearchApiFixture fixture)
{
    [Fact]
    public async Task Health_ReturnsHealthyResponse()
    {
        var response = await fixture.Client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Healthy", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Search_PreflightFromConfiguredFrontendOrigin_ReturnsCorsHeaders()
    {
        using var request = new HttpRequestMessage(HttpMethod.Options, "/api/movies");
        request.Headers.Add("Origin", "http://localhost:5173");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        var response = await fixture.Client.SendAsync(request);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal(
            "http://localhost:5173",
            response.Headers.GetValues("Access-Control-Allow-Origin").Single());
    }

    [Fact]
    public async Task Search_PreflightFromUntrustedOrigin_DoesNotReturnCorsHeaders()
    {
        using var request = new HttpRequestMessage(HttpMethod.Options, "/api/movies");
        request.Headers.Add("Origin", "https://untrusted.example");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        var response = await fixture.Client.SendAsync(request);

        Assert.False(response.Headers.Contains("Access-Control-Allow-Origin"));
    }

    [Fact]
    public async Task Search_WithEmptyCriteria_ReturnsAllMovies()
    {
        var movies = await fixture.Client.GetFromJsonAsync<MovieSummaryDto[]>("/api/movies");

        Assert.NotNull(movies);
        Assert.Equal(9, movies.Length);
        Assert.Equal("Alien", movies[0].Title);
    }

    [Fact]
    public async Task Search_WithCombinedCriteria_ReturnsMatchingSummaries()
    {
        var movies = await fixture.Client.GetFromJsonAsync<MovieSummaryDto[]>(
            "/api/movies?title=matrix&genre=action&actor=keanu");

        Assert.NotNull(movies);
        Assert.Equal(["The Matrix", "The Matrix Reloaded"], movies.Select(movie => movie.Title));
        Assert.All(movies, movie => Assert.Equal("Action", movie.Genre));
    }

    [Fact]
    public async Task Search_WithNoMatch_ReturnsEmptyArray()
    {
        var response = await fixture.Client.GetAsync("/api/movies?title=not-a-seeded-movie");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var movies = await response.Content.ReadFromJsonAsync<MovieSummaryDto[]>();
        Assert.NotNull(movies);
        Assert.Empty(movies);
    }

    [Theory]
    [InlineData("title", 201, nameof(MovieSearchRequest.Title))]
    [InlineData("genre", 101, nameof(MovieSearchRequest.Genre))]
    [InlineData("actor", 201, nameof(MovieSearchRequest.Actor))]
    public async Task Search_WithCriterionOverMaximumLength_ReturnsValidationProblem(
        string queryParameter,
        int length,
        string propertyName)
    {
        var value = new string('x', length);

        var response = await fixture.Client.GetAsync($"/api/movies?{queryParameter}={value}");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.Status);
        Assert.Contains(propertyName, problem.Errors.Keys);
    }

    [Theory]
    [InlineData("title", 200)]
    [InlineData("genre", 100)]
    [InlineData("actor", 200)]
    public async Task Search_WithCriterionAtMaximumLength_PassesValidation(
        string queryParameter,
        int length)
    {
        var value = new string('x', length);

        var response = await fixture.Client.GetAsync($"/api/movies?{queryParameter}={value}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var movies = await response.Content.ReadFromJsonAsync<MovieSummaryDto[]>();
        Assert.NotNull(movies);
        Assert.Empty(movies);
    }

    [Fact]
    public async Task GetById_WithExistingMovie_ReturnsDetailsAndOrderedCast()
    {
        var movie = await fixture.Client.GetFromJsonAsync<MovieDetailsDto>("/api/movies/1");

        Assert.NotNull(movie);
        Assert.Equal("The Matrix", movie.Title);
        Assert.Equal("Action", movie.Genre);
        Assert.Equal(new DateOnly(1999, 3, 31), movie.ReleaseDate);
        Assert.NotEmpty(movie.Description);
        Assert.Equal(
            ["Carrie-Anne Moss", "Keanu Reeves", "Laurence Fishburne"],
            movie.Actors.Select(actor => actor.Name));
    }

    [Fact]
    public async Task GetById_WithUnknownMovie_ReturnsNotFoundProblem()
    {
        var response = await fixture.Client.GetAsync("/api/movies/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(StatusCodes.Status404NotFound, problem.Status);
        Assert.Equal("Movie not found", problem.Title);
    }

    [Fact]
    public async Task GetById_WithNonPositiveId_ReturnsValidationProblem()
    {
        var response = await fixture.Client.GetAsync("/api/movies/0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.Status);
        Assert.Contains("id", problem.Errors.Keys);
    }
}