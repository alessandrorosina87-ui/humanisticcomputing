#!/usr/bin/env bash
set -euo pipefail

# =============================================
# safe-deploy.sh
# Safe deployment with verification and confirmation
# =============================================

EXPECTED_PROJECT="humanisticcomputing"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Run verification
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Safe Deploy - ${EXPECTED_PROJECT}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}Running pre-deploy verification...${NC}"
echo ""
bash "$(dirname "$0")/verify-project.sh"
echo ""

# Step 2: Show what will be deployed
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Services to deploy:${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "  • ${GREEN}Hosting${NC}     (public/)"
echo -e "  • ${GREEN}Firestore${NC}   (firestore.rules)"
echo -e "  • ${GREEN}Storage${NC}     (storage.rules)"
echo ""
echo -e "${YELLOW}Target project: ${EXPECTED_PROJECT}${NC}"
echo ""

# Step 3: Ask for confirmation
read -r -p "$(echo -e "${RED}Deploy to ${EXPECTED_PROJECT}? (y/N): ${NC}")" CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo -e "${YELLOW}Deploy cancelled.${NC}"
  exit 0
fi

# Step 4: Deploy
echo ""
echo -e "${BLUE}Deploying to ${EXPECTED_PROJECT}...${NC}"
echo ""
firebase deploy --project "$EXPECTED_PROJECT"

# Step 5: Show success
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy completed successfully! ✓${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  🌐 ${BLUE}https://${EXPECTED_PROJECT}.web.app${NC}"
echo -e "  🔧 ${BLUE}https://console.firebase.google.com/project/${EXPECTED_PROJECT}${NC}"
echo ""
