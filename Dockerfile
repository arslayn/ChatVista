# Simple Dockerfile for React application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port for development server
EXPOSE 4173

# Serve the built application using Vite preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]