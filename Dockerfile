# Nginx stage (only serves prebuilt React app)
FROM nginx:alpine

# Copy built React app
COPY build /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
