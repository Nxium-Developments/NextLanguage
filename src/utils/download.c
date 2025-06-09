#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <zip.h>
#include <sys/stat.h>
#include <direct.h>  // For _mkdir on Windows
#include <errno.h>
#include <windows.h> // For MoveFileEx

#define DOWNLOAD_DIR "./downloads"
#define TEMP_EXTRACT_DIR "./downloads/tmp_extract"
#define ZIP_FILE_PATH "./downloads/node.zip"

size_t write_data(void *ptr, size_t size, size_t nmemb, FILE *stream) {
    return fwrite(ptr, size, nmemb, stream);
}

int download_file(const char *url, const char *output) {
    CURL *curl = curl_easy_init();
    if (!curl) {
        fprintf(stderr, "Failed to init curl\n");
        return 1;
    }

    FILE *fp = fopen(output, "wb");
    if (!fp) {
        perror("fopen");
        return 1;
    }

    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);

    CURLcode res = curl_easy_perform(curl);
    fclose(fp);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        fprintf(stderr, "Download failed: %s\n", curl_easy_strerror(res));
        return 1;
    }

    return 0;
}

int extract_zip(const char *zip_path, const char *dest_path) {
    int err = 0;
    zip_t *zip = zip_open(zip_path, ZIP_RDONLY, &err);
    if (!zip) {
        fprintf(stderr, "Failed to open zip file: %d\n", err);
        return 1;
    }

    zip_int64_t num_entries = zip_get_num_entries(zip, 0);
    for (zip_uint64_t i = 0; i < num_entries; i++) {
        const char *name = zip_get_name(zip, i, 0);
        if (!name) continue;

        char full_path[512];
        snprintf(full_path, sizeof(full_path), "%s/%s", dest_path, name);

        if (name[strlen(name) - 1] == '/') {
            _mkdir(full_path);
        } else {
            zip_file_t *zf = zip_fopen_index(zip, i, 0);
            if (!zf) continue;

            FILE *fout = fopen(full_path, "wb");
            if (!fout) continue;

            char buffer[4096];
            zip_int64_t bytes;
            while ((bytes = zip_fread(zf, buffer, sizeof(buffer))) > 0) {
                fwrite(buffer, 1, bytes, fout);
            }

            fclose(fout);
            zip_fclose(zf);
        }
    }

    zip_close(zip);
    return 0;
}

int rename_extracted_folder(const char *from_base, const char *to_name) {
    WIN32_FIND_DATAA ffd;
    HANDLE hFind = FindFirstFileA(strcat(strcpy((char[512]){0}, from_base), "\\node-v*"), &ffd);
    if (hFind == INVALID_HANDLE_VALUE) {
        fprintf(stderr, "No matching extracted folder found.\n");
        return 1;
    }

    char from_path[512];
    snprintf(from_path, sizeof(from_path), "%s/%s", from_base, ffd.cFileName);
    char to_path[512];
    snprintf(to_path, sizeof(to_path), "%s/%s", DOWNLOAD_DIR, to_name);

    MoveFileExA(from_path, to_path, MOVEFILE_REPLACE_EXISTING);
    FindClose(hFind);
    return 0;
}

// int main() {
//     _mkdir(DOWNLOAD_DIR);
//     _mkdir(TEMP_EXTRACT_DIR);

//     const char *url = "https://nodejs.org/dist/v22.16.0/node-v22.16.0-win-x64.zip";
//     const char *final_name = "my-node";

//     printf("Downloading...\n");
//     if (download_file(url, ZIP_FILE_PATH)) {
//         fprintf(stderr, "Failed to download file.\n");
//         return 1;
//     }

//     printf("Extracting...\n");
//     if (extract_zip(ZIP_FILE_PATH, TEMP_EXTRACT_DIR)) {
//         fprintf(stderr, "Failed to extract ZIP.\n");
//         return 1;
//     }

//     printf("Renaming...\n");
//     if (rename_extracted_folder(TEMP_EXTRACT_DIR, final_name)) {
//         fprintf(stderr, "Failed to rename folder.\n");
//         return 1;
//     }

//     printf("Cleaning up...\n");
//     remove(ZIP_FILE_PATH);

//     printf("Done.\n");
//     return 0;
// }