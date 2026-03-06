# Backend Dockerfile
FROM node:20-alpine

# Install dependencies for Prisma and postgresql client
RUN apk add --no-cache openssl postgresql-client

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies using pnpm (include devDependencies for Prisma CLI)
RUN npm install -g pnpm && pnpm install --frozen-lockfile --ignore-scripts=false

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# Expose port
EXPOSE 8080

# Health check - simple TCP check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD nc -z localhost 8080 || exit 1

# Start the application - run migrations first, then start server
# Use exit 1 if migrations fail to prevent starting with uninitialized DB
CMD ["sh", "-c", "npx prisma migrate deploy || { echo 'Migration failed!'; exit 1; } && node dist/main.js"]
