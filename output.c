#include <stdio.h>
#include <stdlib.h>

int* alloc_int(int val) {
    int* ptr = malloc(sizeof(int));
    *ptr = val;
    return ptr;
}

int main() {
    int* sum = alloc_int(*4  + *5);
    return 0;
}
