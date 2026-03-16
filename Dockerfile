# Backend Dockerfile - Optimized for Coolify
FROM node:20-alpine

# Install dependencies for Prisma and postgresql client
RUN apk add --no-cache openssl postgresql-client curl

# Create app directory
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

# Start the application
# Note: Coolify handles environment variables
CMD ["sh", "-c", "
  echo 'Checking database connection...';
  
  # Wait for database to be ready (Coolify provides DATABASE_URL)
  if [ -n \"$DATABASE_URL\" ]; then
    until prisma db execute --stdin <<< 'SELECT 1' 2>/dev/null; do
      echo 'Database unavailable - sleeping';
      sleep 3;
    done;
    echo 'Database connected!';
    
    echo 'Running migrations...';
    npx prisma migrate deploy --schema=./prisma/schema.prisma --skip-generate || {
      echo 'Migration note: Tables may already exist or need manual review';
    };
  else
    echo 'WARNING: DATABASE_URL not set - skipping migrations';
  fi;
  
  echo 'Starting application...';
  exec node dist/main.js
"]
