#!/usr/bin/env bash
set -euo pipefail

# =============================================
# verify-project.sh
# Verifies Firebase CLI, login, and project targeting
# =============================================

EXPECTED_PROJECT="humanisticcomputing"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Firebase Project Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check 1: Firebase CLI installed
echo -e "${YELLOW}[1/4]${NC} Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
  echo -e "${RED}✗ Firebase CLI is not installed.${NC}"
  echo -e "  Install it with: npm install -g firebase-tools"
  exit 1
fi
FIREBASE_VERSION=$(firebase --version 2>/dev/null || echo "unknown")
echo -e "${GREEN}✓ Firebase CLI found (${FIREBASE_VERSION})${NC}"

# Check 2: User is logged in
echo -e "${YELLOW}[2/4]${NC} Checking Firebase login status..."
if ! firebase login:list 2>/dev/null | grep -q "@"; then
  echo -e "${RED}✗ You are not logged in to Firebase.${NC}"
  echo -e "  Run: firebase login"
  exit 1
fi
echo -e "${GREEN}✓ Firebase user is logged in${NC}"

# Check 3: .firebaserc points to correct project
echo -e "${YELLOW}[3/4]${NC} Checking .firebaserc configuration..."
if [ ! -f ".firebaserc" ]; then
  echo -e "${RED}✗ .firebaserc file not found.${NC}"
  exit 1
fi

CONFIGURED_PROJECT=$(grep -o '"default": *"[^"]*"' .firebaserc | sed 's/"default": *"//;s/"//')
if [ "$CONFIGURED_PROJECT" != "$EXPECTED_PROJECT" ]; then
  echo -e "${RED}✗ .firebaserc points to '${CONFIGURED_PROJECT}' instead of '${EXPECTED_PROJECT}'${NC}"
  echo -e "${RED}  ABORTING: Wrong project configured!${NC}"
  exit 1
fi
echo -e "${GREEN}✓ .firebaserc targets '${EXPECTED_PROJECT}'${NC}"

# Check 4: Active project matches expected
echo -e "${YELLOW}[4/4]${NC} Checking active Firebase project..."
ACTIVE_PROJECT=$(firebase use 2>/dev/null | grep -o 'humanisticcomputing' || echo "")
if [ -z "$ACTIVE_PROJECT" ]; then
  echo -e "${YELLOW}⚠ Active project does not match. Setting project...${NC}"
  firebase use "$EXPECTED_PROJECT" --project "$EXPECTED_PROJECT"
  echo -e "${GREEN}✓ Active project set to '${EXPECTED_PROJECT}'${NC}"
else
  echo -e "${GREEN}✓ Active project is '${EXPECTED_PROJECT}'${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  All checks passed! ✓${NC}"
echo -e "${GREEN}========================================${NC}"
