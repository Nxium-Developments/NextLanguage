#!/bin/bash

# Define color variables
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Colored echo function
cecho() {
    local color=$1
    shift
    local message=$1
    shift
    echo -en "${color}${message}${NC}"
}

cecho $BLUE "[Debug] " 
cecho $NC "complete"
echo # Moves to the next Line
echo # Moves to the next Line

echo "Press Enter to continue..."
read -r