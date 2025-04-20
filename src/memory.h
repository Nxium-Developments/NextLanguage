// memory.h
#ifndef MEMORY_H
#define MEMORY_H

#include <stdio.h>

// Function to allocate an integer and add to memory list
int* alloc_int(int value);

// Function to free an allocated integer
void free_int(int* ptr);

// Function to free all allocated memory
void free_all();

#endif // MEMORY_H
