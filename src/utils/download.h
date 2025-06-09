#ifndef DOWNLOAD_H
#define DOWNLOAD_H

int download_file(const char* url, const char* filepath);
int extract_zip(const char* zip_path, const char* extract_path);
int rename_extracted_folder(const char* extract_path, const char* final_name);

#endif