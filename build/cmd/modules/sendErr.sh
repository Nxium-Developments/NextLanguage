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

# Example usage
for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line
sleep 1

cecho $RED "[INFO] "
cecho $NC "Fetching data from pervious endpoint..."
echo # Moves to the next Line

for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

echo # Moves to the next Line
sleep 1

cecho $RED "[Debug] "
cecho $NC "Failed to fetch data"
echo # Moves to the next Line

echo # Moves to the next Line
sleep 1

cecho $RED "[Debug] "
cecho $NC "throw.err - (More information on the error sided below)"
echo # Moves to the next Line

echo "fetch.data.err - fetch.data.endpoint(true.false | string)"
echo "throw.err(fetch.data == failed.true) - endpoint.connect(true.false | string)"
echo "endpoint.connect(fetch.connect.failed == true) - endpoint.http(0012 | string)"

echo # Moves to the next Line
echo # Moves to the next Line

cecho $YELLOW "The nxos servers failed to connect, or have been failed to be reached"
cecho $YELLOW "or that the endpoint for this request have not been setup yet."
cecho $YELLOW "If you are just a visitor or believe, that this is a mistake. Please contact the admin"

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line

cecho $BLUE "If you are the owner of this server, please setup the endpoint"
cecho $BLUE "or contact Nxium-Developments, if you suspect the servers belong"
cecho $BLUE "to Nxium-Developments. Thank you!"

echo # Moves to the next Line

cecho $GREEN "More information on Nxium Servers at https://nxium-endpoint.com/docs"
cecho $NC "NextLanguage is owned by Project NEXT, and Nxium Developments as a"
cecho $NC "Collaborator. All assets belong to both Nxium Developments and Project NEXT"

echo # Moves to the next Line
sleep 1

cecho $RED "[ERROR] "
cecho $NC "You may exit this error at anytime by pressing Ctrl + C or ENTER"
echo # Moves to the next Line

read -r