# Backend Dockerfile
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache openssl curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=5 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
