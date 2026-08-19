using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieSearch.Api.Domain.Entities;

namespace MovieSearch.Api.Data.Configurations;

internal sealed class GenreConfiguration : IEntityTypeConfiguration<Genre>
{
    public void Configure(EntityTypeBuilder<Genre> builder)
    {
        builder.ToTable("Genres");

        builder.HasKey(genre => genre.Id);

        builder.Property(genre => genre.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(genre => genre.Name)
            .IsUnique();

        builder.HasData(DatabaseSeed.Genres);
    }
}