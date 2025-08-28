FROM node:20

WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Expose port
EXPOSE 5173

# Start development server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
