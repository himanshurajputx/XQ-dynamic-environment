#!/bin/bash

# Variables
DOMAIN="prefinn.com"     # Change to your domain or IP (used in server_name)
SSL_DIR="/root/node_server/ssl"
NGINX_CONF="/etc/nginx/sites-available/nestjs"
NGINX_LINK="/etc/nginx/sites-enabled/nestjs"
APP_PORT=3000

echo "🔧 Installing Nginx..."
apt update && apt install -y nginx

echo "📁 Creating Nginx config for NestJS app..."

cat > "$NGINX_CONF" << EOF
server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate     $SSL_DIR/cert.pem;
    ssl_certificate_key $SSL_DIR/key.pem;

    location / {
        proxy_pass https://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}
EOF

echo "🔗 Enabling site config..."
ln -sf "$NGINX_CONF" "$NGINX_LINK"

echo "🧪 Testing Nginx config..."
nginx -t || { echo "❌ Nginx config error"; exit 1; }

echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo "✅ Nginx is set up with SSL reverse proxy for NestJS app!"
