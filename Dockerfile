# Build Stage
FROM node:20 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy the package management files first to leverage Docker cache
COPY package.json package-lock.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install

# Copy the rest of the application source code
COPY . .

# Check the files in the container
RUN ls -la /usr/src/app

# Build the application (if needed)
RUN yarn run build

# Execution Stage - Use a smaller image for the final app
FROM node:20-alpine3.20

# Set the working directory
WORKDIR /usr/src/app

# Copy over the dependencies and built application from the build stage
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/scripts.js ./scripts.js
COPY --from=build /usr/src/app/scripts.js ./server.js
COPY --from=build /usr/src/app/styles.css ./styles.css
COPY --from=build /usr/src/app/index.html ./index.html
COPY --from=build /usr/src/app/img/ ./img/

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
