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

cecho $BLUE "[Installation] "
cecho $NC "Checking if "
cecho $YELLOW "node.js"
cecho $NC " is installed..."
echo # Moves to the next Line

sleep 1

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    cecho $RED "[Debug] "
    cecho $NC "Node.js is not installed"
    echo # Moves to the next Line

    sleep 1

    cecho $BLUE "[Installation] "
    cecho $NC "Installing Node.js..."
    echo # Moves to the next Line

    sleep 1

    current_directory=$(pwd)
    cecho $BLUE "[Debug] "
    cecho $NC "Current directory: $current_directory"
    echo # Moves to the next Line

    sleep 1

    if $current_directory == "../../NextLanguage/build/lib/export"; then
        cecho $BLUE "[Debug] "
        cecho $NC "Installation Path is in the correct Directory"
        echo # Moves to the next Line

        sleep 1

        cecho $BLUE "[Installation] "
        cecho $NC "Installing Node.js..."
        echo # Moves to the next Line

        sleep 1

        curl.exe --output node-v21.7.1-win-x64.zip -0 https://nodejs.org/dist/v21.7.1/node-v21.7.1-win-x64.zip
        curl.exe --output node-v21.7.1-win-x86.zip -0 https://nodejs.org/dist/v21.7.1/node-v21.7.1-win-x86.zip
        curl.exe --output node-v21.7.1-win-arm64.zip -0 https://nodejs.org/dist/v21.7.1/node-v21.7.1-win-arm64.zip

        cecho $BLUE "[Debug] "
        cecho $NC "Downloaded Node.js ZIP Files"
        echo # Moves to the next Line

        sleep 1

        cecho $BLUE "[Debug] "
        cecho $NC "Extracting Node.js ZIP Files..."
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[Terminal] "
        cecho $NC "Please wait..."
        echo # Moves to the next Line

        sleep 1
        
        cecho $YELLOW "[Terminal] "
        cecho $NC "/System32/powershell.exe"
        echo # Moves to the next Line
        
        sleep 1

        cecho $YELLOW "[Terminal] "
        cecho $NC "sys32.exe"
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[System32] "
        cecho $NC "Checking System Architecture..."
        echo # Moves to the next Line

        sleep 1

        # Path to the script to be executed
        script_to_execute="sysArchitecture.sh"

        # Check if the script exists
        if [ -e "$script_to_execute" ]; then
            # Execute the script
            bash "$script_to_execute"
        else
            cecho $RED "[System32-debug] "
            cecho $NC "Script not found: $script_to_execute"
            echo # Moves to the next Line

            sleep 1

            cecho $RED "[System32-debug] "
            cecho $NC "Exiting..."
            echo # Moves to the next Line

            sleep 1

            cecho $RED "[System32-debug] "
            cecho $NC "Press enter to continue..."
            echo # Moves to the next Line

            read -r
            exit 1
        fi

        # Get the system architecture
        arch=$(uname -m)

        # Check the architecture
        case $arch in
            x86_64)
                echo "System architecture: x64"
                ;;
            i686|i386)
                echo "System architecture: x86"
                ;;
            i386:x86-64)
                echo "System architecture: x32"
                ;;
            aarch64)
                echo "System architecture: ARM64"
                ;;
            *)
                echo "Unknown system architecture: $arch"
                ;;
        esac

        cecho $YELLOW "[System32-debug] "
        cecho $NC "System Architecture: $arch"
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[System32-debug] "
        cecho $NC "Exiting sys.exe"
        echo # Moves to the next Line

        sleep 1

        cecho $GREEN "[Terminal] "
        cecho $NC "Completed tasks. Now Exiting.."
        echo # Moves to the next Line

        sleep 1

        cecho $BLUE "[Debug] "
        cecho $NC "Contiuning Node.js Installation..."
        echo # Moves to the next Line

        sleep 1

        if [ "$arch" == "x86_64" ]; then
            cecho $BLUE "[Debug] "
            cecho $NC "Extracting Node.js ZIP Files..."
            echo # Moves to the next Line

            sleep 1

            unzip -q node-v21.7.1-win-x64.zip

            cecho $BLUE "[Debug] "
            cecho $NC "Extracted Node.js ZIP Files"
            echo # Moves to the next Line

            sleep 1

        else if [ "$arch" == "i686|i386" ]; then
            cecho $BLUE "[Debug] "
            cecho $NC "Extracting Node.js ZIP Files..."
            echo # Moves to the next Line

            sleep 1

            unzip -q node-v21.7.1-win-x86.zip

            cecho $BLUE "[Debug] "
            cecho $NC "Extracted Node.js ZIP Files"
            echo # Moves to the next Line

            sleep 1

        else if [ "$arch" == "aarch64" ]; then
            cecho $BLUE "[Debug] "
            cecho $NC "Extracting Node.js ZIP Files..."
            echo # Moves to the next Line

            sleep 1

            unzip -q node-v21.7.1-win-arm64.zip

            cecho $BLUE "[Debug] "
            cecho $NC "Extracted Node.js ZIP Files"
            echo # Moves to the next Line

            sleep 1

        else if [ "$arch" == "i386:x86-64" ]; then
            cecho $YELLOW "[Debug] "
            cecho $NC "Unsupported System Architecture"
            echo # Moves to the next Line

            sleep 1

            cecho $RED "[Debug] "
            cecho $NC "Exiting..."
            echo # Moves to the next Line

            sleep 1

            cecho $RED "[System32-debug] "
            cecho $NC "Press enter to continue..."
            echo # Moves to the next Line

            read -r
            exit 1
        fi
    else
        cecho $RED "[Debug] "
        cecho $NC "Installation Path is not in the correct Directory"
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[Debug] "
        cecho $NC "Installation Path: NextLanguage/build/lib/export"
        echo # Moves to the next Line

        sleep 1

        cecho $BLUE "[Debug] "
        cecho $NC "Changing Directory to NextLanguage/build/lib/export"
        echo # Moves to the next Line

        sleep 1

        cd "../../build/lib/export"
        current_directory=$(pwd)

        cecho $BLUE "[Debug] "
        cecho $NC "Current Directory: $current_directory"
        echo # Moves to the next Line

        sleep 1

        cecho $BLUE "[Installation] "
        cecho $NC "Installing Node.js..."
        echo # Moves to the next Line

        sleep 1
        
        curl.exe --output node-v21.7.1-win-x64.zip -0 https://nodejs.org/dist/v21.7.1/node-v21.7.1-win-x64.zip
        curl.exe --output node-v21.7.1-win-x86.zip -0 https://nodejs.org/dist/v21.7.1/node-v21.7.1-win-x86.zip
        curl.exe --output node-v21.7.1-win-arm64.zip -0 https://nodejs.org/dist/v21.7.1/node-v21.7.1-win-arm64.zip

        cecho $BLUE "[Debug] "
        cecho $NC "Downloaded Node.js ZIP Files"
        echo # Moves to the next Line

        sleep 1

        cecho $BLUE "[Debug] "
        cecho $NC "Extracting Node.js ZIP Files..."
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[Terminal] "
        cecho $NC "Please wait..."
        echo # Moves to the next Line

        sleep 1
        
        cecho $YELLOW "[Terminal] "
        cecho $NC "/System32/powershell.exe"
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[Terminal] "
        cecho $NC "sys32.exe"
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[System32] "
        cecho $NC "Checking System Architecture..."
        echo # Moves to the next Line

        sleep 1

        # Path to the script to be executed
        script_to_execute="sysArchitecture.sh"

        # Check if the script exists
        if [ -e "$script_to_execute" ]; then
            # Execute the script
            bash "$script_to_execute"
        else
            cecho $RED "[System32-debug] "
            cecho $NC "Script not found: $script_to_execute"
            echo # Moves to the next Line

            cecho $RED "[System32-debug] "
            cecho $NC "Exiting..."
            echo # Moves to the next Line

            cecho $RED "[System32-debug] "
            cecho $NC "Press enter to continue..."
            echo # Moves to the next Line

            read -r
            exit 1
        fi

        # Get the system architecture
        arch=$(uname -m)

        # Check the architecture
        case $arch in
            x86_64)
                echo "System architecture: x64"
                ;;
            i686|i386)
                echo "System architecture: x86"
                ;;
            i386:x86-64)
                echo "System architecture: x32"
                ;;
            aarch64)
                echo "System architecture: ARM64"
                ;;
            *)
                echo "Unknown system architecture: $arch"
                ;;
        esac

        cecho $YELLOW "[System32-debug] "
        cecho $NC "System Architecture: $arch"
        echo # Moves to the next Line

        sleep 1

        cecho $YELLOW "[System32-debug] "
        cecho $NC "Exiting sys.exe"
        echo # Moves to the next Line

        sleep 1

        cecho $GREEN "[Terminal] "
        cecho $NC "Completed tasks. Now Exiting.."
        echo # Moves to the next Line

        sleep 1

        cecho $BLUE "[Debug] "
        cecho $NC "Contiuning Node.js Installation..."
        echo # Moves to the next Line

        sleep 1

        if [ "$arch" == "x86_64" ]; then
            cecho $BLUE "[Debug] "
            cecho $NC "Extracting Node.js ZIP Files..."
            echo # Moves to the next Line

            sleep 1

            unzip -q node-v21.7.1-win-x64.zip

            cecho $BLUE "[Debug] "
            cecho $NC "Extracted Node.js ZIP Files"
            echo # Moves to the next Line

            sleep 1

        else if [ "$arch" == "i686|i386" ]; then
            cecho $BLUE "[Debug] "
            cecho $NC "Extracting Node.js ZIP Files..."
            echo # Moves to the next Line

            sleep 1

            unzip -q node-v21.7.1-win-x86.zip

            cecho $BLUE "[Debug] "
            cecho $NC "Extracted Node.js ZIP Files"
            echo # Moves to the next Line

            sleep 1

        else if [ "$arch" == "aarch64" ]; then
            cecho $BLUE "[Debug] "
            cecho $NC "Extracting Node.js ZIP Files..."
            echo # Moves to the next Line

            sleep 1

            unzip -q node-v21.7.1-win-arm64.zip

            cecho $BLUE "[Debug] "
            cecho $NC "Extracted Node.js ZIP Files"
            echo # Moves to the next Line

            sleep 1

        else if [ "$arch" == "i386:x86-64" ]; then
            cecho $YELLOW "[Debug] "
            cecho $NC "Unsupported System Architecture"
            echo # Moves to the next Line

            sleep 1

            cecho $RED "[Debug] "
            cecho $NC "Exiting..."
            echo # Moves to the next Line

            sleep 1

            cecho $RED "[System32-debug] "
            cecho $NC "Press enter to continue..."
            echo # Moves to the next Line

            read -r
            exit 1
        fi

    fi
else
    cecho $GREEN "[Debug] "
    cecho $NC "Node.js is installed"
    echo # Moves to the next Line

    sleep 1
fi

cecho $YELLOW "[INFO] "
cecho $NC "Press enter to continue..."
echo # Moves to the next Line

read -r
exit 1