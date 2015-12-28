@echo off

cls
del /Q dist
mkdir dist

echo ======================================================
echo          EyeTraffic Chrome extension 
echo .
echo Update version number in manifest.json
echo ======================================================
pause

echo **************** finalize
copy bg.html dist
copy popup.html dist
copy toast.html dist
copy *.js dist
copy *.json dist

xcopy /e /Y /I _locales dist\_locales
xcopy /e /Y /I css dist\css
xcopy /e /Y /I data dist\data
xcopy /e /Y /I images dist\images
xcopy /e /Y /I lib dist\lib

echo ======================================================
echo Then to upload source into Google Westore, zip build/dist
echo or to test it as local crx, use Extensions page, go to "Pack extension"
echo   choose build\dist folder and key file build\dist.pem
echo ======================================================
pause