#!/bin/bash

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

exit 1
