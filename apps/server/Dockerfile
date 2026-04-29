FROM oven/bun:1.3.5 AS build
WORKDIR /app

# Copy workspace manifests
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/package.json
COPY packages ./packages

# Install only server graph & compile binary
RUN bun install --filter server

COPY apps/server ./apps/server

WORKDIR /app/apps/server
RUN bun build src/index.ts \
  --compile \
  --minify \
  --outfile server


# Runtime stage (Distroless)
FROM gcr.io/distroless/base-debian12
WORKDIR /app

COPY --from=build /app/apps/server/server ./server

USER nonroot

EXPOSE 3000

CMD ["./server"]