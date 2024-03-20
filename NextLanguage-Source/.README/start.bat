@echo off
setlocal

rem Check if config file exists
if exist config.txt (
    rem Read config file
    set /p nxlFile=<config.txt
) else (
    rem Ask for .nxl file name
    set /p nxlFile=Enter the .nxl file name: 
    rem Save the .nxl file name to config file
    echo %nxlFile% > config.txt
)

cd ".."

rem Execute node app.js with the .nxl file name
node app.js %nxlFile%

endlocal
