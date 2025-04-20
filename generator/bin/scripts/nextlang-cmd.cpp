#include <iostream>
#include <string>

int main(int argc, char* argv[]) {
    // Check if the correct number of arguments is passed
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <command> [file]" << std::endl;
        return 1;
    }

    // Get the command argument
    std::string command = argv[1];
    std::string file = (argc > 2) ? argv[2] : "";

    // Handle the "build" command
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
    }
    // Handle the "run" command
    else if (command == "run") {
        if (file.empty()) {
            std::cerr << "Error: Please specify a file to run with 'run'." << std::endl;
            return 1;
        }

        // Construct the npm start command with the user-provided file
        std::string npmCommand = "npm start " + file;
        std::cout << "Executing: " << npmCommand << std::endl;
        int result = std::system(npmCommand.c_str());

        // Check if the command was successful
        if (result != 0) {
            std::cerr << "Error: Command failed with code " << result << "." << std::endl;
            return result;
        }
    }
    // Handle invalid commands
    else {
        std::cerr << "Error: Invalid command. Use 'build' or 'run'." << std::endl;
        return 1;
    }

    return 0;
}
