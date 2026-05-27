#!/usr/bin/env bash
set -euo pipefail

# =============================================
# setup.sh
# Initial project setup
# =============================================

EXPECTED_PROJECT="humanisticcomputing"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Project Setup - ${EXPECTED_PROJECT}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check/install Firebase CLI
echo -e "${YELLOW}[1/4]${NC} Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
  echo -e "${YELLOW}Firebase CLI not found. Installing...${NC}"
  npm install -g firebase-tools
  echo -e "${GREEN}✓ Firebase CLI installed${NC}"
else
  FIREBASE_VERSION=$(firebase --version 2>/dev/null || echo "unknown")
  echo -e "${GREEN}✓ Firebase CLI found (${FIREBASE_VERSION})${NC}"
fi

# Step 2: Verify login
echo -e "${YELLOW}[2/4]${NC} Checking Firebase login..."
if ! firebase login:list 2>/dev/null | grep -q "@"; then
  echo -e "${YELLOW}Not logged in. Opening browser for login...${NC}"
  firebase login
fi
echo -e "${GREEN}✓ Firebase user is logged in${NC}"

# Step 3: Select project
echo -e "${YELLOW}[3/4]${NC} Selecting Firebase project..."
firebase use "$EXPECTED_PROJECT" --project "$EXPECTED_PROJECT"
echo -e "${GREEN}✓ Project set to '${EXPECTED_PROJECT}'${NC}"

# Step 4: Install npm dependencies
echo -e "${YELLOW}[4/4]${NC} Installing npm dependencies..."
if [ -f "package.json" ]; then
  npm install
  echo -e "${GREEN}✓ Dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠ No package.json found, skipping npm install${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup complete! ✓${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  Next steps:"
echo -e "    1. Copy ${BLUE}.env.example${NC} to ${BLUE}.env${NC} and fill in your Firebase config"
echo -e "    2. Run ${BLUE}npm run verify${NC} to check everything is configured"
echo -e "    3. Run ${BLUE}npm run serve${NC} to start local development"
echo ""
