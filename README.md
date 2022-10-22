# egangotri-react-dashboard
React Based Dashboard for eGangotri Front End


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
