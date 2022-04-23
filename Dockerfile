FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./

COPY . .

RUN npm install

#Note: App Service currently allows your container to expose only one port for HTTP requests.
EXPOSE 3000

ENV REACT_APP_DEV_ENV prod

CMD [ "npm", "run", "start" ]
