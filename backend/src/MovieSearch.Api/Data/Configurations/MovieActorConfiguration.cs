using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieSearch.Api.Domain.Entities;

namespace MovieSearch.Api.Data.Configurations;

internal sealed class MovieActorConfiguration : IEntityTypeConfiguration<MovieActor>
{
    public void Configure(EntityTypeBuilder<MovieActor> builder)
    {
        builder.ToTable("MovieActors");

        builder.HasKey(movieActor => new { movieActor.MovieId, movieActor.ActorId });

        builder.HasIndex(movieActor => movieActor.ActorId);

        builder.HasOne(movieActor => movieActor.Movie)
            .WithMany(movie => movie.MovieActors)
            .HasForeignKey(movieActor => movieActor.MovieId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(movieActor => movieActor.Actor)
            .WithMany(actor => actor.MovieActors)
            .HasForeignKey(movieActor => movieActor.ActorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasData(DatabaseSeed.MovieActors);
    }
}