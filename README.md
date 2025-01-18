<p align="center">

<img src="https://github.com/kreso975/StergoSmartGUI/blob/main/img/StergoLogo.svg" width="150">

</p>

<span align="center">

### Bootstrap 5
# Stergo Smart GUI 

</span>

<img src="https://img.shields.io/badge/node-^18.20.4%20%7C%7C%20^20.16.0%20%7C%7C%20^22.5.1-brightgreen"> &nbsp;
[![Donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://paypal.me/kreso975)

This is GUI for StergoSmart project running on IoT devices  
It compiles index.html and captive.html  
It also generates config.json  
  
Everything is setup in settings.ini  
<br><br>
  
  

> [!NOTE]
> For compiling GUI in order to optimize code and code size, it is required to install node module preprocess https://www.npmjs.com/package/preprocess  
> Inside your project repository  
> $ npm install --save preprocess  
>  
> Github https://github.com/jsoverson/preprocess  
>  
> in build.js there is a setup for creating .gz, default for windows is 7zip external,  
> but there is a code to use node library for creating .gz  
> check the source code.  

> [!TIP]
> In file settings.ini Change:  
> device = 'LS001';  - WHERE LS001 is Device Type
> onNasOrDevice = 'production'; // production || development  
>  

> [!IMPORTANT]
> Build Captive and index:  
> command: node build  
>  
> rename .env_Template to .env  
> .env is ignored for commit so you can put sensitive data there. Use same variable names that needs to be changed  
>  
  
  
## Screenshots of GUI  
  
**Dashboard**  
  
<div style="display: flex; flex-wrap: wrap; gap: 10px;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Weather-Dashboard.png?raw=true" alt="Weather Dashboard" title="Weather Dashboard" style="width: 30%;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Weather-Clock-Dashboard.png?raw=true" alt="Weather Clock Dashboard" title="Weather Clock Dashboard" style="width: 30%;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Switch-Dashboard.png?raw=true" alt="Switch Dashboard" title="Switch Dashboard" style="width: 30%;"> </div>  

**Info & Log**  
  
<div style="display: flex; justify-content: center;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Info-and-Log.png?raw=true" alt="Info & Log" title="Info & Log" style="width: 30%;"> </div>
  
   
**Publish**  
  
<div style="display: flex; justify-content: center;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Module-Settings.png?raw=true" alt="Publish" title="Publish" style="width: 30%;"> </div>

  
**WiFi**  
  
<div style="display: flex; flex-wrap: wrap; gap: 10px;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Wifi-Setup.png?raw=true" alt="WiFi" title="WiFi" style="width: 30%;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/WiFi-available-AP.png?raw=true" alt="WiFi available networks" title="WiFi available networks" style="width: 30%;"> </div>
  

**Settings**  
  

<div style="display: flex; justify-content: center;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Settings.png?raw=true" alt="Settings" title="Settings" style="width: 30%;"> </div>
  

**Captive portal** 
  
  
<div style="display: flex; justify-content: center;"> <img src="https://github.com/kreso975/StergoSmart/blob/main/ScreenShots/Captive-portal.png?raw=true" alt="Captive portal" title="Captive portal" style="width: 30%;"> </div>
