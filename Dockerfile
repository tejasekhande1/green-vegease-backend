# Use the latest stable Node.js image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Install TypeScript and ts-node globally for development convenience
RUN npm install -g typescript ts-node

# Install nodemon as a development dependency
RUN npm install -g -D nodemon

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

ENTRYPOINT [ "./entrypoint.sh" ]

# Command to run the application in development mode
CMD ["npm", "run", "dev"]
