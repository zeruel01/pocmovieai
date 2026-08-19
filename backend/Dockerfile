FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY MovieSearch.sln ./
COPY src/MovieSearch.Api/MovieSearch.Api.csproj src/MovieSearch.Api/
RUN dotnet restore src/MovieSearch.Api/MovieSearch.Api.csproj

COPY src/MovieSearch.Api/ src/MovieSearch.Api/
RUN dotnet publish src/MovieSearch.Api/MovieSearch.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

COPY --from=build /app/publish ./

USER $APP_UID

HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
    CMD curl --fail --silent http://127.0.0.1:8080/health || exit 1

ENTRYPOINT ["dotnet", "MovieSearch.Api.dll"]