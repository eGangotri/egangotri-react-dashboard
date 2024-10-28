netstat -ano | findstr :3000
if errorlevel 1 (
    echo Port 3000 is free
    cd C:\ws\egangotri-react-dashboard
    pnpm run start
) else (
    echo Port 3000 is in use
)

netstat -ano | findstr :8000
if errorlevel 1 (
    echo Port 8000 is free
    cd C:\ws\egangotri-node-backend
    pnpm run upload_db
) else (
    echo Port 3000 is in use
)