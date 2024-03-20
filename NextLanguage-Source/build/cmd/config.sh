#!/bin/sh

# Compile NextLanguage
gcc -Wall -Wextra -std=c11 -o nl src/nl.c src/util.c

# Install compiled binaries
install -D -m 755 nl /usr/local/bin/nl

# Configuration
export NL_HOME=/usr/local/share/nl
mkdir -p $NL_HOME
