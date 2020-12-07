echo off
cls
for %%i in ("%cd%") do set fName=%%~ni
echo %fName%
"C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe" /command:update /path:%cd% /closeonend 3
"C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe" /command:update /path:%cd%/../../h10-d-zzcq/%fName%/client/resource/ /closeonend 3

@echo off
set baseDir=%cd%/src/
set prefix=V1.14
set suffix=%computername%

if "%baseDir%" == "" set baseDir=%cd%
::echo baseDir:%baseDir%
echo %baseDir%
set loc=%baseDir%\Version.ts
echo location=%loc%

set mon=%date:~5,2%
set day=%date:~8,2%
set hou=%time:~0,2%
set min=%time:~3,2%

if %date:~5,1% == 0 set mon=%date:~6,1%
if %date:~8,1% == 0 set day=%date:~9,1%

set buildNum=%prefix%.%mon%.%day%.%hou%%min%-%suffix%
echo buildNumber=%buildNum%
echo module Version{export const BUILD_NUMBER: string = "%buildNum%";} > %loc%

::pause

