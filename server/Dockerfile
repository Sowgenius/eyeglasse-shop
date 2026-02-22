# Backend Dockerfile
FROM node:20-alpine

# Install dependencies for Prisma
RUN apk add --no-cache openssl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --production

# Expose port
EXPOSE 8080

# Health check - simple TCP check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD nc -z localhost 8080 || exit 1

# Start the application
CMD ["node", "dist/main.js"]
