@echo off

START  /wait ./../build/cmd/jobs/install-win.sh
setlocal

cd ".."

if exist ../config.nxconf (
    node init.js
) else (
    echo "WARNING: The initization script will set your Default app filename to (app.nxl) outside of the NextLanguage folder, on your main directory. You may change this by accessing the (config.nxconf) file, using an file editing software, and changing the contents to the filename of your main file."
    echo .
    
    echo "DEBUG: The logs sent below here, are the following logs sent by the generated project files:"    
    echo .

    node app.js app.nxl

    echo .
    echo "INFO: The project files has been generated sucessfully, and has been placed in the root directory outside of NXL (NextLanguage)"
)

endlocal

echo            . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
echo               'The project files has been sucessfully generated'
echo            . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

pause
