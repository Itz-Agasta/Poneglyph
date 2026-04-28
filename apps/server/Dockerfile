FROM oven/bun:1.3.5 AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN bun install --frozen-lockfile --filter server

FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY apps/server ./apps/server
COPY packages/auth ./packages/auth
COPY packages/config ./packages/config
COPY packages/db ./packages/db
COPY packages/env ./packages/env
COPY packages/schemas ./packages/schemas
WORKDIR /usr/src/app/apps/server
RUN mkdir -p ./node_modules \
 && rm -rf ./node_modules/tsdown \
 && ln -s /usr/src/app/node_modules/tsdown ./node_modules/tsdown \
 && /usr/src/app/node_modules/.bin/tsdown --config tsdown.config.ts

FROM base AS prod-deps
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN bun install --frozen-lockfile --production --filter server

FROM oven/bun:1.3.5-slim AS release
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/server/dist ./dist
USER bun
EXPOSE 3000/tcp
CMD ["bun", "dist/index.mjs"]
