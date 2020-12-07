@echo off
cls

for %%i in ("%cd%") do set fName=%%~ni
echo %fName%
set fileName=main.min.js

set dd=%cd%/../../h10-d/%fName%/client/resource/

svnupdate.bat && egret publish --version 1 &&(
cd bin-release/web/1

copy /Y "%fileName%" "%dd%\%fileName%"

cd %dd%
svn ci main.min.js -m build
)