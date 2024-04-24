FROM node:18

# Create app directory
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./

COPY . .

RUN npm install -g npm@10.5.2
RUN npm install -g --force yarn@latest

RUN yarn install
RUN yarn add path
RUN yarn global add serve

ENV PORT 3000

EXPOSE 3000

ENV REACT_APP_DEV_ENV prod

RUN yarn run build

#npx serve -s build -l 3000
CMD ["npx","serve", "-s", "build", "-l", "3000"]