# Load Balancer Setup

## Option 1: Using PM2 (Development/Production)

### Install PM2
```bash
npm install -g pm2
```

### Start all instances
```bash
pm2 start ecosystem.config.js
```

### Monitor instances
```bash
pm2 monit
```

### Stop all instances
```bash
pm2 stop all
```

## Option 2: Using Docker Compose (Production)

### Build and start
```bash
docker-compose up -d
```

### Scale services
```bash
docker-compose up -d --scale backend-1=3 --scale frontend-1=2
```

### Stop all
```bash
docker-compose down
```

## Option 3: Using Nginx (Manual)

### Install Nginx
- Windows: Download from https://nginx.org/en/download.html
- Linux: `sudo apt install nginx`

### Configure Nginx
Copy `nginx.conf` to:
- Windows: `C:\nginx\conf\nginx.conf`
- Linux: `/etc/nginx/sites-available/peaktech`

### Start Nginx
- Windows: `nginx.exe`
- Linux: `sudo systemctl start nginx`

### Start backend instances manually
```bash
cd backend
PORT=5000 npm start &
PORT=5001 npm start &
PORT=5002 npm start &
```

### Start frontend instances manually
```bash
cd frontend
PORT=3000 npm start &
PORT=3001 npm start &
```

## Load Balancing Strategy

- **Algorithm**: Least Connections (distributes to server with fewest active connections)
- **Health Checks**: Automatic failover if server fails 3 times in 30 seconds
- **Sticky Sessions**: Not enabled (stateless API)

## Access

- Load Balanced App: http://localhost (port 80)
- Direct Backend: http://localhost:5000, 5001, 5002
- Direct Frontend: http://localhost:3000, 3001
