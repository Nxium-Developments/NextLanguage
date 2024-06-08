#!/bin/bash

echo "Checking if Node.js is installed..."

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Installing..."
    # Install Node.js and npm
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
