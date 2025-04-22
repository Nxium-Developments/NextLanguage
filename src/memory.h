#ifndef MEMORY_H
#define MEMORY_H

int* alloc_int(int value);
void free_int(int* ptr);
void free_all(void);

#endif
