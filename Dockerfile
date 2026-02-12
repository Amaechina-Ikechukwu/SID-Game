# ---- Stage 1: Build the React frontend ----
FROM oven/bun:1 AS frontend-build

WORKDIR /app/client

# Install client dependencies
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile || bun install

# Copy client source and build
COPY client/ ./
RUN bun run build


# ---- Stage 2: Production server ----
FROM oven/bun:1 AS production

WORKDIR /app

# Install backend dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile || bun install --production

# Copy backend source
COPY src/ ./src/
COPY public/ ./public/
COPY tsconfig.json ./

# Copy built frontend from stage 1
COPY --from=frontend-build /app/client/dist /app/client/dist

# Cloud Run uses PORT env variable
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the server with Bun
CMD ["bun", "run", "src/server.ts"]
