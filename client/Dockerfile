# Frontend Dockerfile
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Health check - simple TCP check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

# Start the application
CMD ["pnpm", "start"]
