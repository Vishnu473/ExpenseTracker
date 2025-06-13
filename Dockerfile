# Use lightweight Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Set environment variables (optional – best to use GCP Secret Manager instead)
# ENV PORT=5000

# Expose port
EXPOSE 8080

# Start the app (pointing to built JS file)
CMD ["node", "dist/index.js"]