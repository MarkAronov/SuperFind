# syntax=docker/dockerfile:1
# Dockerfile for SkillVector Backend with Bun
# Bun runs TypeScript directly — no compilation step needed, single stage is sufficient
# Pin to 1.3 to match the text-based bun.lock format (introduced in 1.2.0)
FROM oven/bun:1.4
WORKDIR /app

# Install dependencies first (separate layer for Docker cache efficiency)
COPY package.json bun.lock ./
# Install dependencies with BuildKit cache mount so packages are reused between builds
# instead of downloading from scratch every time
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs bunuser
USER bunuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
