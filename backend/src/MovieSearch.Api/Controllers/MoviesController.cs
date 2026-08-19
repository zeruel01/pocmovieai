using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using MovieSearch.Api.Contracts;
using MovieSearch.Api.Services;

namespace MovieSearch.Api.Controllers;

[ApiController]
[Route("api/movies")]
[Produces("application/json")]
public sealed class MoviesController(IMovieService movieService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<MovieSummaryDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<MovieSummaryDto>>> Search(
        [FromQuery] MovieSearchRequest request,
        CancellationToken cancellationToken)
    {
        var movies = await movieService.SearchAsync(request, cancellationToken);
        return Ok(movies);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<MovieDetailsDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MovieDetailsDto>> GetById(
        [Range(1, int.MaxValue)] int id,
        CancellationToken cancellationToken)
    {
        var movie = await movieService.GetByIdAsync(id, cancellationToken);

        if (movie is null)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Movie not found",
                detail: $"No movie with ID {id} exists.");
        }

        return Ok(movie);
    }
}