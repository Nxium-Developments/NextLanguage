#include <iostream>
#include <string>

int main(int argc, char* argv[]) {
    // Check if the correct number of arguments is passed
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <command>" << std::endl;
        return 1;
    }

    // Get the argument
    std::string command = argv[1];

    // Check if the argument matches the condition
    if (command == "build") {
        std::cout << "Running 'npm run build'..." << std::endl;

        // Execute the npm run build command
        int result = std::system("npm run build");

        // Check if the command was successful
        if (result == 0) {
            std::cout << "'npm run build' completed successfully." << std::endl;
        } else {
            std::cerr << "Error: 'npm run build' failed with code " << result << "." << std::endl;
            return result;
        }
    } else {
        std::cerr << "Error: Invalid command. Use 'build' to run 'npm run build'." << std::endl;
        return 1;
    }

    return 0;
}
