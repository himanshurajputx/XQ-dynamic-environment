#!/bin/bash



# CONFIG
SERVER_IP="147.93.96.111"
USER="root"
PASSWORD="8?VQA80SMEwSWzdD1Sc@"
APP_NAME="prefinn-app"
ZIP_NAME="dist.zip"
REMOTE_DIR="/root/node_server"
LOCAL_BUILD_DIR="dist"
DEPLOY_FILES=("dist" "package.json" "environment" )

# 1. Build the NestJS app
echo "🔨 Building the app..."
rm -rf $LOCAL_BUILD_DIR environment
#npm run nest-build
npm run build-prod

# 2. Zip the build and package.json
echo "📦 Creating deployment zip..."
rm -f $ZIP_NAME
zip -r $ZIP_NAME "${DEPLOY_FILES[@]}"

# 3. Send the zip to the server
echo "📤 Uploading to server..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "$ZIP_NAME" "$USER@$SERVER_IP:$REMOTE_DIR/"
#
## 4. SSH into server to handle deployment
echo "🚀 Deploying on remote server..."
sshpass -p "$PASSWORD" ssh -tt $USER@$SERVER_IP << EOF

# Create deployment directory if not exists
mkdir -p $REMOTE_DIR

# Move and unzip
mv /root/$ZIP_NAME $REMOTE_DIR/
cd $REMOTE_DIR
rm -rf $LOCAL_BUILD_DIR
unzip -o $ZIP_NAME
rm -f $ZIP_NAME

# Install dependencies
echo "📦 Installing node modules..."
npm install

# Restart or start app with PM2
echo "🟢 Starting with PM2..."
pm2 delete $APP_NAME || true
#pm2 start "node $LOCAL_BUILD_DIR/server.js" --name "$APP_NAME"
#pm2 start "npm run start:prod" --name "$APP_NAME"
pm2 start "npm run start:server" --name "$APP_NAME"

EOF

echo "✅ Deployment complete!"
