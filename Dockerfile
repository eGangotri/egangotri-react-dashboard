FROM node:16

# Create app directory
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./

COPY . .

RUN npm install -g npm@8.7.0
RUN npm install

RUN npm install -g serve

ENV PORT 3000

EXPOSE 3000

ENV REACT_APP_DEV_ENV prod

RUN npm run build

#npx serve -s build -l 3000
CMD ["npx","serve", "-s", "build", "-l", "3000"]