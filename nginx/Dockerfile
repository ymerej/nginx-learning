# nginx/Dockerfile
FROM nginx:stable-alpine

# Install the nginx NJS module
RUN apk add --no-cache nginx-module-njs

# Remove default nginx configuration and replace with our custom one
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the custom Nginx configuration files
COPY conf/ /etc/nginx/conf.d/
# Copy the NJS scripts
COPY njs/ /etc/nginx/njs/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
