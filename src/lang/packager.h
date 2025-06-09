#ifndef PACKAGER_H
#define PACKAGER_H

#ifdef __cplusplus
extern "C" {
#endif

// Bundles multiple text files into a single .pack file using UTF-8 encoding.
// Parameters:
//   output_filename: name of the resulting bundle file (.pack)
//   input_files: array of file path strings
//   file_count: number of input files
// Returns 0 on success, non-zero on error.
int bundle_files(const char *output_filename, const char *input_files[], int file_count);

#ifdef __cplusplus
}
#endif

#endif // PACKAGER_H
