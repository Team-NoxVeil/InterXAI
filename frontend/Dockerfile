# Frontend Dockerfile for InterXAI
# 
# This Dockerfile builds and serves the React/Vite frontend application
# using Nginx for production deployment.
#
# Build stage: compiles TypeScript and bundles the application
# Serve stage: serves static files via Nginx

# =============================================================================
# BUILD STAGE
# =============================================================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies using npm ci for reproducible builds
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application
# Outputs static files to /app/dist
RUN npm run build

# =============================================================================
# SERVE STAGE
# =============================================================================
FROM nginx:1.27-alpine

# Install security updates
RUN apk upgrade --no-cache

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check to ensure the server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
