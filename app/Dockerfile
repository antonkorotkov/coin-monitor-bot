# Use the official Node.js image as the base image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container image.
COPY . .

ENV DEBUG=*

# Run the application
CMD ["node", "index.js"]