#!/usr/bin/env bash
set -euo pipefail

# =============================================
# backup-firestore.sh
# Creates timestamped Firestore backup
# =============================================

EXPECTED_PROJECT="humanisticcomputing"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Firestore Backup - ${EXPECTED_PROJECT}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Run verification
echo -e "${YELLOW}Running pre-backup verification...${NC}"
echo ""
bash "$(dirname "$0")/verify-project.sh"
echo ""

# Step 2: Create timestamped backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/firestore_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}✓ Backup directory created: ${BACKUP_DIR}${NC}"
echo ""

# Step 3: Show backup instructions based on plan
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Backup Methods${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}📋 Spark Plan (Free) - Manual Export:${NC}"
echo -e "  The Spark plan does not support automated Firestore exports."
echo -e "  Use one of these methods to backup your data:"
echo ""
echo -e "  ${GREEN}Option 1: Firebase Console${NC}"
echo -e "    1. Go to https://console.firebase.google.com/project/${EXPECTED_PROJECT}/firestore"
echo -e "    2. Navigate to each collection"
echo -e "    3. Use the export button (⋮ menu) to download data"
echo -e "    4. Save exported files to: ${BACKUP_DIR}/"
echo ""
echo -e "  ${GREEN}Option 2: Firebase CLI (read data)${NC}"
echo -e "    firebase firestore:get --project ${EXPECTED_PROJECT}"
echo ""
echo -e "  ${GREEN}Option 3: Custom script${NC}"
echo -e "    Write a Node.js script using Admin SDK to read and export collections"
echo -e "    Save output to: ${BACKUP_DIR}/"
echo ""

echo -e "${YELLOW}📋 Blaze Plan (Pay-as-you-go) - Automated Export:${NC}"
echo -e "  If you upgrade to Blaze, you can use managed exports:"
echo ""
echo -e "   gcloud firestore export gs://humanisticcomputing.appspot.com/backups/$(date '+%Y-%m-%d')"
echo ""
echo -e "  Or schedule automated backups with Cloud Functions / Cloud Scheduler."
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Backup directory ready: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}========================================${NC}"
