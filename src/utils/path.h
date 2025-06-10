#ifndef PATH_H
#define PATH_H

#define PATH_MAX 4096

extern char base_dir[1024];

void get_executable_path();
char* make_path(const char* filename);

#endif
