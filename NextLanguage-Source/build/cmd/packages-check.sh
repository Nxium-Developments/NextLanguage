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

cecho $BLUE "[Terminal] "
cecho $NC "Please wait"
echo # Moves to the next Line

sleep 1

cecho $BLUE "[Terminal - INFO] "
cecho $NC "Checking dependencies..."

sleep 1

if ! command -v node &> /dev/null; then
    cecho $RED "[Terminal - Debug] "
    cecho $NC "node.js is not installed"
    echo # Moves to the next Line

    sleep 1

    cecho $YELLOW "[Terminal - Debug] "
    cecho $NC "Please install Node.js..."
    echo # Moves to the next Line

    sleep 1

else
    cecho $GREEN "[Terminal - Debug] "
    cecho $NC "node.js is installed"
    echo # Moves to the next Line

    sleep 1

fi

if ! command -v npm &> /dev/null; then
    cecho $RED "[Terminal - Debug] "
    cecho $NC "npm is not installed"
    echo # Moves to the next Line

    sleep 1

    cecho $YELLOW "[Terminal - Debug] "
    cecho $NC "Please install NPM package installer..."
    echo # Moves to the next Line

    sleep 1

else
    cecho $GREEN "[Terminal - Debug] "
    cecho $NC "npm is installed"
    echo # Moves to the next Line

    sleep 1

fi

cecho $BLUE "[Terminal - INFO] "
cecho $NC "Task Completeted, exiting..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Press enter to continue..."
echo # Moves to the next Line

read -r

cecho $BLUE "[INFO] "
cecho $NC "Contiuning to install packages..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Installing required NPM packages"
echo # Moves to the next Line

sleep 1

npm update
npm install

cecho $BLUE "[INFO] "
cecho $NC "Now checking if all packages are installed..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "All packages are installed"
echo # Moves to the next Line

exit 1