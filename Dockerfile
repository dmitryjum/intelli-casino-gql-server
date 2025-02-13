# Use an official Node.js runtime as a parent image
FROM node:23-alpine3.20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for dependency caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Generate Prisma client for Linux
RUN npx prisma generate

# Expose the port your Express server runs on (e.g., 4000)
EXPOSE 4000

# Start the server using the compiled JavaScript files
CMD ["node", "-r", "module-alias/register", "dist/src/index.js"]
