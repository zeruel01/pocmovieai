namespace MovieSearch.Api.IntegrationTests.Infrastructure;

[CollectionDefinition(Name)]
public sealed class MovieSearchApiCollection : ICollectionFixture<MovieSearchApiFixture>
{
    public const string Name = "Movie search API";
}