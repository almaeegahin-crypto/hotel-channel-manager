#!/bash
# Automation script for Hotel Channel Manager VPS Setup
# Run this on your root server: bash deploy.sh

echo "--- Starting Deployment Setup ---"

# 1. Update and Install Node.js
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx

# 2. Install PM2
npm install -g pm2

# 3. Create Project Directory
mkdir -p /var/www/hotel-manager
echo "Project directory created: /var/www/hotel-manager"

# 4. Nginx Configuration
cat <<EOF > /etc/nginx/sites-available/chanalmanager.kreos.site
server {
    listen 80;
    server_name chanalmanager.kreos.site;

    location / {
        root /var/www/hotel-manager/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/chanalmanager.kreos.site /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

echo "--- Setup Complete ---"
echo "Next: Upload your backend and frontend/dist folders to /var/www/hotel-manager"
