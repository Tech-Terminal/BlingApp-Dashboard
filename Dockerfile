# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build-only

# Production stage
FROM nginx:alpine AS production

# Copy built static files from builder to nginx default public directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy a custom nginx configuration if needed to handle Vue Router history mode
# We will create an nginx configuration block to handle history mode fallback
RUN echo 'server { \
    listen       80; \
    server_name  localhost; \
    root         /usr/share/nginx/html; \
    index        index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
