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
    std::string file = argv[2];

    // Check if the argument matches the condition
    if (command == "build") {
        std::cout << "Building Project..." << std::endl;

        // Execute the npm run build command
        int result = std::system("npm run build");

        // Check if the command was successful
        if (result == 0) {
            std::cout << "Completed build successfully." << std::endl;
        } else {
            std::cerr << "Error: Project build failed with code " << result << "." << std::endl;
            return result;
        }
    } else if (command == ".") {
        // Execute the npm run build command
        std::system("npm start");
    } else if (command == "run") {
        std::system("npm start");
    } else {
        std::cerr << "Error: Invalid command. Use 'build' to run 'npm run build'." << std::endl;
        return 1;
    }

    return 0;
}
