FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install Chrome dependencies for Puppeteer
RUN apk update && apk add --no-cache \
   chromium \
   nss \
   freetype \
   freetype-dev \
   harfbuzz \
   ca-certificates \
   ttf-freefont \
   && rm -rf /var/cache/apk/*

# Tell Puppeteer to skip installing Chrome. We'll be using the installed version.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create shared directories
RUN mkdir -p /app/shared/cv

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN rm -rf dist
RUN npm run build

# Expose the port your app runs on (adjust if different)
EXPOSE 7000 5000
