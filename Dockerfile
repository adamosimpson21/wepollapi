# Use npm 8.11.3
FROM node:8.11.3
ENV LAST_UPDATED 20181228T000000

# Copy source code
COPY . /wepollapi

# Change working directory
WORKDIR /wepollapi

# Install dependencies
RUN npm install

# Expose API port to the outside
EXPOSE 8080

# Any environment variables
ENV SECRET_KEY 4r48ur84ur8jfdjfj08ejf0f98j2feff4yggfbvnj
ENV PORT 4000

# Launch application
CMD ["nodemon", "mongod"]