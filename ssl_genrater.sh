#!/bin/bash

# Server credentials
SERVER_IP="147.93.96.111"
USER="root"
PASSWORD="8?VQA80SMEwSWzdD1Sc@"
SSL_DIR="/root/node_server/ssl"

# Function to run a command remotely
run_remote() {
  sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$USER@$SERVER_IP" "$1"
}

echo "✅ Connecting to $SERVER_IP..."

# 1. Create ssl folder if it doesn't exist
echo "📁 Checking/Creating SSL folder..."
run_remote "mkdir -p $SSL_DIR"

# 2. Run OpenSSL commands to generate key, CSR, and cert
echo "🔐 Generating SSL key..."
run_remote "cd $SSL_DIR && openssl genrsa -out key.pem 2048"

echo "📄 Generating CSR..."
run_remote "cd $SSL_DIR && openssl req -new -key key.pem -out csr.pem -subj '/C=IN/ST=Delhi/L=Delhi/O=XQubit/OU=Dev/CN=www.prefinn.com'"

echo "🔏 Creating SSL certificate..."
run_remote "cd $SSL_DIR && openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem"

echo "✅ SSL certificate generated in $SSL_DIR on $SERVER_IP"
