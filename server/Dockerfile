# Backend Dockerfile - Optimized for Coolify
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache openssl postgresql-client curl

WORKDIR /app

# Copy package files
COPY server/package*.json server/pnpm-lock.yaml ./
COPY server/prisma ./prisma/
COPY server/prisma.config.ts ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile --ignore-scripts=false

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY server/ ./

# Build TypeScript
RUN pnpm run build

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Default command - Coolify can override with migration command
CMD ["node", "dist/main.js"]
