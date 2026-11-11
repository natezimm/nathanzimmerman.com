# The Ask my portfolio API. Build from api/ after CI has built index.json and fetched the embedding
# model into models/files (see .github/workflows/ask.yml): both are baked into the image, so a
# deploy swaps the index and the code together, and the container needs no network but Anthropic's.

FROM mcr.microsoft.com/dotnet/sdk:11.0 AS build
ARG TARGETARCH
WORKDIR /src
COPY global.json Directory.Build.props Directory.Packages.props ./
COPY src/ src/
# ReadyToRun, as in Know Ball: a fresh container answers its first question sooner.
RUN dotnet publish src/PortfolioAsk.Api -c Release -a "$TARGETARCH" --self-contained false -p:PublishReadyToRun=true -o /out

FROM mcr.microsoft.com/dotnet/aspnet:11.0
# Links the GHCR package to this repository, so the workflow's token can push and pull it.
LABEL org.opencontainers.image.source=https://github.com/natezimm/nathanzimmerman.com
# tzdata, so the daily token budget resets at midnight Eastern rather than UTC.
RUN apt-get update \
 && apt-get install -y --no-install-recommends tzdata \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /out ./
COPY index.json ./index.json
COPY models/manifest.json ./models/manifest.json
COPY models/files/ ./models/files/

# One small API on a shared VM: workstation GC keeps the heap small, and .NET sizes it to the
# container's memory limit.
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_gcServer=0 \
    DOTNET_GCConserveMemory=5
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "PortfolioAsk.Api.dll"]
