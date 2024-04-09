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

cecho $YELLOW "[OS] "
cecho $NC "Checking the OS..."
echo # Moves to the next Line

# Check if the OS is Linux or Windows
if [[ "$(uname)" == "Linux" ]]; then
    cecho $YELLOW "[OS] "
    cecho $NC "Operating system is Linux"
    echo # Moves to the next Line

elif [[ "$(uname)" == "Darwin" ]]; then
    cecho $YELLOW "[OS] " 
    cecho $NC "Operating system is macOS"
    echo # Moves to the next Line

elif [[ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]]; then
    cecho $YELLOW "[OS] "
    cecho $NC "Operating system is Windows"
    echo # Moves to the next Line
else
    cecho $RED "[Debug | OS] "
    cecho $NC "Unsupported operating system"
    echo # Moves to the next Line
fi