using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using MovieSearch.Api.Data;
using Testcontainers.PostgreSql;

namespace MovieSearch.Api.IntegrationTests.Infrastructure;

public sealed class MovieSearchApiFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer database = new PostgreSqlBuilder("postgres:17-alpine")
        .WithDatabase("movie_search_tests")
        .WithUsername("movie_search")
        .WithPassword("movie_search_tests")
        .Build();

    private MovieSearchApiFactory? factory;

    public HttpClient Client { get; private set; } = null!;

    public IServiceProvider Services => factory?.Services
        ?? throw new InvalidOperationException("The API fixture has not been initialized.");

    public async Task InitializeAsync()
    {
        await database.StartAsync();

        factory = new MovieSearchApiFactory(database.GetConnectionString());

        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MovieDbContext>();
        await dbContext.Database.MigrateAsync();

        Client = factory.CreateClient();
    }

    public async Task DisposeAsync()
    {
        Client?.Dispose();

        if (factory is not null)
        {
            await factory.DisposeAsync();
        }

        await database.DisposeAsync();
    }

    private sealed class MovieSearchApiFactory(string connectionString) : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<MovieDbContext>>();
                services.RemoveAll<MovieDbContext>();
                services.AddDbContext<MovieDbContext>(options =>
                    options.UseNpgsql(connectionString));
            });
        }
    }
}