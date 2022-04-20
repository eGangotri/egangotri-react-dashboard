# egangotri-react-dashboard
React Based Dashboard for eGangotri Front End


# To Start
npm run start
nodemon --exec npm run start
View at http://localhost:3000/

## Docker
docker build . -t egangotri/egangotri-react-dashboard
docker run -d -p 8080:80  egangotri/egangotri-react-dashboard:latest
docker login
docker push  egangotri/egangotri-react-dashboard

http://ip_address:80/