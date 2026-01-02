# Build stage
FROM node:18-alpine as build

# Install bun
RUN npm install -g bun

WORKDIR /app

# Copy package files
COPY package*.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]