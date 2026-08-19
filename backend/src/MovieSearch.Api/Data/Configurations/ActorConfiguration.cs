using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieSearch.Api.Domain.Entities;

namespace MovieSearch.Api.Data.Configurations;

internal sealed class ActorConfiguration : IEntityTypeConfiguration<Actor>
{
    public void Configure(EntityTypeBuilder<Actor> builder)
    {
        builder.ToTable("Actors");

        builder.HasKey(actor => actor.Id);

        builder.Property(actor => actor.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.HasIndex(actor => actor.Name)
            .HasMethod("gin")
            .HasOperators("gin_trgm_ops");

        builder.HasData(DatabaseSeed.Actors);
    }
}