using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieSearch.Api.Domain.Entities;

namespace MovieSearch.Api.Data.Configurations;

internal sealed class MovieConfiguration : IEntityTypeConfiguration<Movie>
{
    public void Configure(EntityTypeBuilder<Movie> builder)
    {
        builder.ToTable("Movies");

        builder.HasKey(movie => movie.Id);

        builder.Property(movie => movie.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(movie => movie.Description)
            .HasMaxLength(4_000)
            .IsRequired();

        builder.Property(movie => movie.ReleaseDate)
            .HasColumnType("date");

        builder.HasIndex(movie => movie.Title)
            .HasMethod("gin")
            .HasOperators("gin_trgm_ops");

        builder.HasIndex(movie => movie.GenreId);

        builder.HasOne(movie => movie.Genre)
            .WithMany(genre => genre.Movies)
            .HasForeignKey(movie => movie.GenreId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasData(DatabaseSeed.Movies);
    }
}