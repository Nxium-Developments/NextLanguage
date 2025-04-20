#include <stdio.h>
#include <stdlib.h>

typedef struct MemoryBlock {
    void* ptr;
    struct MemoryBlock* next;
} MemoryBlock;

MemoryBlock* memory_list = NULL; // Keep track of allocated memory blocks

// Function to allocate memory for an integer and add it to memory tracking list
int* alloc_int(int value) {
    int* ptr = malloc(sizeof(int));  // Allocate memory
    if (!ptr) {
        printf("Memory allocation failed!\n");
        exit(1);
    }
    *ptr = value;  // Initialize the allocated memory with the given value

    // Add to memory tracking list
    MemoryBlock* block = malloc(sizeof(MemoryBlock));
    block->ptr = ptr;
    block->next = memory_list;
    memory_list = block;

    return ptr;
}


// Function to free memory and remove from memory tracking list
void free_int(int* ptr) {
    if (!ptr) return; // Don't free a null pointer

    // Find the block in the list and remove it
    MemoryBlock* prev = NULL;
    MemoryBlock* current = memory_list;

    while (current != NULL) {
        if (current->ptr == ptr) {
            if (prev) {
                prev->next = current->next;
            } else {
                memory_list = current->next; // Removing the first element
            }

            free(ptr);  // Free the allocated memory
            free(current);  // Free the memory block itself
            return;
        }

        prev = current;
        current = current->next;
    }

    // If no block was found, that's an error
    printf("Attempted to free untracked memory!\n");
    exit(1);
}

// Function to free all allocated memory
void free_all() {
    MemoryBlock* current = memory_list;

    while (current != NULL) {
        free(current->ptr);  // Free the memory
        MemoryBlock* temp = current;
        current = current->next;
        free(temp);  // Free the memory block itself
    }

    memory_list = NULL;  // Reset the memory list
}
