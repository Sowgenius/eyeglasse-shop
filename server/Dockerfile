# Backend Dockerfile
FROM node:20-alpine

# Install dependencies for Prisma and postgresql client
RUN apk add --no-cache openssl postgresql-client curl

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

# Health check - check the API health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Start the application
# Strategy:
# 1. Wait for database to be ready
# 2. Run migrations (idempotent - safe to run multiple times)
# 3. Start the server
CMD ["sh", "-c", "
  echo 'Waiting for database to be ready...';
  until nc -z ${DB_HOST:-postgres} ${DB_PORT:-5432} 2>/dev/null || prisma db execute --stdin <<< 'SELECT 1' 2>/dev/null; do
    echo 'Database is unavailable - sleeping';
    sleep 2;
  done;
  
  echo 'Database is ready! Running migrations...';
  npx prisma migrate deploy --schema=./prisma/schema.prisma --skip-generate || {
    echo 'Migration error - checking if tables exist...';
    npx prisma db execute --stdin <<< 'SELECT COUNT(*) FROM users' 2>/dev/null && echo 'Database already initialized' || {
      echo 'FATAL: Database not initialized and migrations failed!';
      exit 1;
    }
  };
  
  echo 'Starting application server...';
  exec node dist/main.js
"]
