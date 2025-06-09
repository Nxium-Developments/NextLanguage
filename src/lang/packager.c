#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function to bundle files into a single .pack file
int bundle_files(const char *output_filename, const char *input_files[], int file_count) {
    FILE *out_file = fopen(output_filename, "w, ccs=UTF-8");
    if (!out_file) {
        perror("Failed to open output file");
        return 1;
    }

    for (int i = 0; i < file_count; ++i) {
        const char *filename = input_files[i];
        FILE *in_file = fopen(filename, "r, ccs=UTF-8");
        if (!in_file) {
            perror("Failed to open input file");
            fclose(out_file);
            return 1;
        }

        // Write header
        fprintf(out_file, "::%s [\n", filename);

        // Read and write content
        int c;
        while ((c = fgetc(in_file)) != EOF) {
            fputc(c, out_file);
        }

        // End of file block
        fprintf(out_file, "]\n");

        fclose(in_file);
    }

    fclose(out_file);
    return 0;
}
