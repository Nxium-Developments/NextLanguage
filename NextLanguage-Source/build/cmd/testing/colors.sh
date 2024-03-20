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

# Example usage
cecho $RED "This is a red message"
cecho $GREEN "This is a green message"
cecho $YELLOW "This is a yellow message"
cecho $BLUE "This is a blue message"
cecho $RED "This is a separate red message"
echo # Move to the next line

echo "Press Enter to continue..."
read -r
