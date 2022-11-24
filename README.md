# egangotri-react-dashboard
React Based Dashboard for eGangotri Front End

# First Time
yarn install

# To Start
npm run start
nodemon --exec npm run start
View at http://localhost:3000/

## Docker
docker build . -t egangotri/egangotri-react-dashboard
docker run -d -p 5000:3000  egangotri/egangotri-react-dashboard:latest
## 3000 refers to the port react launches in
docker login
docker push  egangotri/egangotri-react-dashboard

View Docker Image at 
http://localhost:5000/

##Debugging
if on higher versions of node you may have to modify start script as 
    "start": "react-dotenv && yarn run lint_fix && react-scripts --openssl-legacy-provider start",
    
Due to changes on Node.js v17, --openssl-legacy-provider was added for handling key size on OpenSSL v3. For now i do workaround with this options.

## Microsoft Azure:
## may not be relevant any more
In App Service/Settings/Configuration/Application Settings, add
WEBSITES_PORT=3000
OR in Azure CLI
az webapp config appsettings set --resource-group cp-bq-specialist-rq --name eg-react-fe --settings WEBSITES_PORT=3000


### firebase Deployment
First time
 npm install -g firebase-tools
 firebase init 
afterwards
firebase login
firebase deploy

Viewable at:
https://egangotri-react-dashboard.firebaseapp.com
https://egangotri-react-dashboard.web.app/