# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port (Cloud Run uses PORT env var, default to 8080)
EXPOSE 8080

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]

