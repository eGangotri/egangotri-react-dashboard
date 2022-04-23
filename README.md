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
