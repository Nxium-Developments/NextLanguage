#!/usr/bin/env bash

# Install dependencies
echo "Checking and installing dependencies..."

# Check if Node.js and npm are installed
command -v node >/dev/null 2>&1 || { echo >&2 "Node.js is not installed. Please install it before proceeding."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "npm is not installed. Please install it before proceeding."; exit 1; }

# Install project dependencies
npm install