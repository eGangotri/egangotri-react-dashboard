netstat -ano | findstr :3000
if errorlevel 1 (
    echo Port 3000 is free
    cd C:\ws\egangotri-react-dashboard
    yarn run start
) else (
    echo Port 3000 is in use
)

netstat -ano | findstr :8000
if errorlevel 1 (
    echo Port 8000 is free
    cd C:\ws\egangotri-node-backend
    yarn run upload_db
) else (
    echo Port 3000 is in use
)