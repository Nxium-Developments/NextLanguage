#!/bin/bash

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