using Microsoft.EntityFrameworkCore;
using MovieSearch.Api.Domain.Entities;

namespace MovieSearch.Api.Data;

public sealed class MovieDbContext(DbContextOptions<MovieDbContext> options) : DbContext(options)
{
    public DbSet<Movie> Movies => Set<Movie>();

    public DbSet<Genre> Genres => Set<Genre>();

    public DbSet<Actor> Actors => Set<Actor>();

    public DbSet<MovieActor> MovieActors => Set<MovieActor>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresExtension("pg_trgm");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MovieDbContext).Assembly);
    }
}