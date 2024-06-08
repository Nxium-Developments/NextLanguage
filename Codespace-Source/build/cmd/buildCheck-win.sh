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

# Disable output buffering
export TERM=""

# Function to draw the loading bar
function draw_bar() {
    local width=$1
    local progress=$2
    local bar=""
    local num_chars=$((progress * width / 100))
    
    # Fill the bar
    for ((i = 0; i < num_chars; i++)); do
        bar+="|"
    done
    
    # Print the bar
    printf "[%-*s] %d%%\r" $width "$bar" $progress
}

# Loads the imports data
for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

echo # Moves to the next Line

cecho $RED "[Activation] " 
cecho $NC "Connecting to NextLanguage..."
echo # Moves to the next Line

for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

echo # Moves to the next Line

cecho $GREEN "[Activation] " 
cecho $NC "Connected to NextLanguage"
echo # Moves to the next Line

sleep 1

cecho $YELLOW "[Installation] " 
cecho $NC "Checking if NextLanguage's Latest Build is installed..."
echo # Moves to the next Line

sleep 1

if [ -e ../../build/package/id/version-latest.core_nxa ]; then
    cecho $GREEN "[Installation] "
    cecho $NC "Found Latest release already installed..."
    echo # Moves to the next Line

    sleep 1
else
    cecho $RED "[Installation] "
    cecho $NC "NextLanguage does not have the Latest release. Downloading..."
    echo # Moves to the next Line

    sleep 1

    cecho $RED "[Installation] "
    cecho $NC "Downloading Latest NextLanguage builds..."
    echo # Moves to the next Line

    sleep 1
fi

for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

echo # Moves to the next Line

cecho $GREEN "[Installation] " 
cecho $NC "Downloaded Latest NextLanguage builds"
echo # Moves to the next Line