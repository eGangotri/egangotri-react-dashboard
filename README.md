# egangotri-react-dashboard
React Based Dashboard for eGangotri Front End using vite

# First Time
pnpm install

# To Start
pnpm run start
nodemon --exec pnpm run start
View at http://localhost:3000/

@Error: Digital envelope routines
if you get above error. Enable legacy OpenSSL provider.

On Unix-like (Linux, macOS, Git bash, etc.):

export NODE_OPTIONS=--openssl-legacy-provider
On Windows command prompt:

set NODE_OPTIONS=--openssl-legacy-provider
On PowerShell:

$env:NODE_OPTIONS = "--openssl-legacy-provider

Source: https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported

#### for login use eg***trust@gmail.com
## Docker. Instructions below not needed for Actual hosting. only for a curiosity value of how to get this running on Docker
docker build . -t egangotri/egangotri-react-dashboard
docker run -d -p 5000:3000  egangotri/egangotri-react-dashboard:latest
## 3000 refers to the port react launches in
docker login
docker push  egangotri/egangotri-react-dashboard

View Docker Image at 
http://localhost:5000/

##Debugging
if on higher versions of node you may have to modify start script as 
    "start": "react-dotenv && pnpm run lint_fix && react-scripts --openssl-legacy-provider start",
    
Due to changes on Node.js v17, --openssl-legacy-provider was added for handling key size on OpenSSL v3. For now i do workaround with this options.

#### For Vite Configuration

https://cathalmacdonnacha.com/migrating-from-create-react-app-cra-to-vite
https://cathalmacdonnacha.com/setting-up-eslint-prettier-in-vitejs
