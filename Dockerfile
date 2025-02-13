# Builder Stage
FROM node:23-alpine3.20 AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all sources and build
COPY . .
RUN npm run build
RUN npx prisma generate

# Final Stage
FROM node:23-alpine3.20
WORKDIR /app

# Copy only necessary artifacts from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port that the app listens on
EXPOSE 4000

# Start the server using the compiled code
CMD ["node", "-r", "module-alias/register", "dist/src/index.js"]