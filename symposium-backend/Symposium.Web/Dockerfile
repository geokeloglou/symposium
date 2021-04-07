FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS base

WORKDIR /app

COPY *.sln .

# Restore first, for layer caching puproses
COPY Symposium.Web/Symposium.Web.csproj Symposium.Web/
COPY Symposium.Data/Symposium.Data.csproj Symposium.Data/
COPY Symposium.DTO/Symposium.DTO.csproj Symposium.DTO/
COPY Symposium.Services/Symposium.Services.csproj Symposium.Services/

RUN dotnet restore Symposium.Web/Symposium.Web.csproj

# and then copy the rest of the files..
COPY Configs /Configs
COPY Symposium.Web/ Symposium.Web/
COPY Symposium.DTO/ Symposium.DTO/
COPY Symposium.Data/ Symposium.Data/
COPY Symposium.Services/ Symposium.Services/

#
# Run for development
#
FROM base AS development

RUN dotnet tool install --global dotnet-ef --version 3.1.1
ENV PATH="/root/.dotnet/tools:${PATH}"

WORKDIR /app/Symposium.Web
CMD dotnet watch run
# CMD tail -f /Configs/appsettings.json


#
# Build final release
#
FROM base AS builder

WORKDIR /app/Symposium.Web

RUN dotnet build
RUN dotnet publish -c Release -o /out

#
# Final Image
#
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS final

WORKDIR /out

COPY --from=builder /out .
COPY Configs /Configs

CMD dotnet Symposium.Web.dll
