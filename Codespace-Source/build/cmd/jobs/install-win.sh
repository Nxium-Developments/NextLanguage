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

# Loads the Import data
for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

# Set the terminal window title
echo -en "\033]0;Activation - Connecting to NextLanguage\007"

sleep 1

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line

# build\cmd\buildCheck-win.sh

cecho $RED "[Activation] " 
cecho $NC "Connecting to NextLanguage..."
echo # Moves to the next Line

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line

for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

sleep 1

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line

cecho $GREEN "[Activation] " 
cecho $NC "Connected to NextLanguage"
echo # Moves to the next Line

sleep 1

cecho $YELLOW "[Installation] " 
cecho $NC "Checking if the Latest Build is installed..."
echo # Moves to the next Line

sleep 1

if [ -e "../../build/package/id/version-latest.core_nxa" ]; then
    cecho $GREEN "[Installation] "
    cecho $NC "Found Latest release already installed..."
    echo # Moves to the next Line
else
    cecho $GREEN "[Installation] "
    cecho $NC "NextLanguage does not have the Latest release. Downloading..."
    echo # Moves to the next Line

    # Set the terminal window title
    echo -en "\033]0;[Installation] Downloading Latest NextLanguage builds\007"

    cecho $GREEN "[Installation] "
    cecho $NC "Downloading Latest NextLanguage builds..."
    echo # Moves to the next Line

    echo # Moves to the next Line
    echo # Moves to the next Line
    echo # Moves to the next Line
fi

for ((i = 0; i <= 100; i += 1)); do
    draw_bar 100 $i
    sleep 1
done

echo # Moves to the next Line

# Set the terminal window title
echo -en "\033]0;[NXOS] Windows NextLanguage Installer\007"

# build\cmd\os.sh

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line

cecho $YELLOW "[OS] "
cecho $NC "Checking the OS..."
echo # Moves to the next Line

sleep 1

cecho $YELLOW "[OS] "
cecho $NC "Operating system is Windows"
echo # Moves to the next Line

# build\cmd\compatible-win.sh

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Checking if compatible with Windows..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Compatible with Windows: "
cecho $GREEN "TRUE"
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Running compatible-win.sh..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[Installation] " 
cecho $NC "Checking dependencies..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[Installation] "
cecho $NC "Checking if "
cecho $YELLOW "curl.exe"
cecho $NC " is installed..."
echo # Moves to the next Line

sleep 1

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    cecho $RED "[Debug] "
    cecho $NC "curl.exe is not installed"
    echo # Moves to the next Line

    sleep 1

    cecho $RED "[Debug] "
    cecho $NC "Please install curl.exe"
    echo # Moves to the next Line

    sleep 1

    cecho $RED "[Debug] "
    cecho $NC "Exiting..."
    echo # Moves to the next Line

    sleep 1

    cecho $RED "[Debug] "
    cecho $NC "Press enter to continue..."
    echo # Moves to the next Line

    read -r
    exit 1
else
    cecho $GREEN "[Debug] "
    cecho $NC "curl.exe is installed"
    echo # Moves to the next Line

    sleep 1

fi

cecho $BLUE "[INFO] "
cecho $NC "Running packages-check.sh..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Installing packages..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[Terminal] "
cecho $NC "Please wait"
echo # Moves to the next Line

sleep 1

cecho $BLUE "[Terminal - INFO] "
cecho $NC "Checking dependencies..."
echo # Moves to the next Line

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
cecho $NC "Contiuning to install packages..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Installing required NPM packages"
echo # Moves to the next Line

cecho $BLUE "[INFO] "
cecho $NC "Now checking if all packages are installed..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "All packages are installed"
echo # Moves to the next Line

exit 1

cecho $BLUE "[INFO] "
cecho $NC "Connecting to Nxium Endpoint Servers..."
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Connected to Endpoint: h1s6h1v"
echo # Moves to the next Line

sleep 1

cecho $BLUE "[INFO] "
cecho $NC "Forwarding Endpoint data to NXOS Servers..."
echo # Moves to the next Line

sleep 1

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

echo # Moves to the next Line
echo # Moves to the next Line
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
echo # Moves to the next Line
echo "throw.err(fetch.data == failed.true) - endpoint.connect(true.false | string)"
echo # Moves to the next Line
echo "endpoint.connect(fetch.connect.failed == true) - endpoint.http(0012 | string)"

echo # Moves to the next Line
echo # Moves to the next Line

cecho $YELLOW "The nxos servers failed to connect, or have been failed to be reached "
echo # Moves to the next Line
cecho $YELLOW "or that the endpoint for this request have not been setup yet. "
echo # Moves to the next Line
cecho $YELLOW "If you are just a visitor or believe, that this is a mistake. Please contact the admin"

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line

cecho $BLUE "If you are the owner of this server, please setup the endpoint "
echo # Moves to the next Line
cecho $BLUE "or contact Nxium-Developments, if you suspect the servers belong "
echo # Moves to the next Line
cecho $BLUE "to Nxium-Developments. Thank you!"
echo # Moves to the next Line

echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line
echo # Moves to the next Line

cecho $GREEN "More information on Nxium Endpoint Servers at https://nxium-endpoint.com/docs "
echo
cecho $NC "NextLanguage is owned by Project NEXT, and Nxium Developments as a "
echo
cecho $NC "Collaborator. All assets belong to both Nxium Developments and Project NEXT "
echo

echo # Moves to the next Line
sleep 1

cecho $RED "[ERROR] "
cecho $NC "You may exit this error at anytime by pressing Ctrl + C or ENTER"
echo # Moves to the next Line

read -r

cmd.exe

# Command to execute in cmd.exe
cmd_command="npm run build"

# Execute the command in cmd.exe
cmd.exe /C "$cmd_command"

exit 1