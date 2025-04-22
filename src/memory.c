#include <stdio.h>
#include <stdlib.h>

typedef struct MemoryBlock {
    void* ptr;
    struct MemoryBlock* next;
} MemoryBlock;

static MemoryBlock* memory_list = NULL; // Internal memory tracking list

// Allocate memory for an int and track it
int* alloc_int(int value) {
    int* ptr = (int*)malloc(sizeof(int));
    if (!ptr) {
        fprintf(stderr, "[memory.c] Memory allocation failed!\n");
        exit(EXIT_FAILURE);
    }
    *ptr = value;

    MemoryBlock* block = (MemoryBlock*)malloc(sizeof(MemoryBlock));
    if (!block) {
        fprintf(stderr, "[memory.c] Failed to track memory allocation!\n");
        free(ptr);
        exit(EXIT_FAILURE);
    }

    block->ptr = ptr;
    block->next = memory_list;
    memory_list = block;

    return ptr;
}

// Free a specific int* and remove it from tracking
void free_int(int* ptr) {
    if (!ptr) return;

    MemoryBlock* prev = NULL;
    MemoryBlock* current = memory_list;

    while (current != NULL) {
        if (current->ptr == ptr) {
            if (prev) prev->next = current->next;
            else memory_list = current->next;

            free(ptr);
            free(current);
            return;
        }

        prev = current;
        current = current->next;
    }

    fprintf(stderr, "[memory.c] Attempted to free untracked memory at %p!\n", (void*)ptr);
    exit(EXIT_FAILURE);
}

// Free all tracked allocations
void free_all() {
    MemoryBlock* current = memory_list;
    while (current != NULL) {
        free(current->ptr);

        MemoryBlock* temp = current;
        current = current->next;
        free(temp);
    }

    memory_list = NULL;
}
