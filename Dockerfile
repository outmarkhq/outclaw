FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── Build stage ──
FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm build

# ── Production stage ──
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod 2>/dev/null || pnpm install --prod
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "dist/index.js"]
