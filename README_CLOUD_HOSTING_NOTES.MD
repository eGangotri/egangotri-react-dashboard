### 

in .env use
VITE_BACKEND_SERVER_PROD=https://egangotri-node-backend-dashboard.onrender.com/
Make following as:
VITE_DEV_ENV="prod"


# firebase login is in eg***trust@gmail.com
### firebase Deployment
### First time only
 npm install -g firebase-tools
 firebase init 
afterwards
firebase login 
### Deployment
pnpm build
firebase deploy

Project Console: https://console.firebase.google.com/project/egangotri-dashboard/overview
Hosting URL: https://egangotri-dashboard.web.app