# Use Node 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Compile TypeScript
RUN npx tsc

# Start the app
CMD ["node", "dist/src/server.js"]