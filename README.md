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
<br><br>
  
  

> [!NOTE]
> For compiling GUI in order to optimize code and code size, it is required to install node module preprocess https://www.npmjs.com/package/preprocess  
> Inside your project repository  
> $ npm install --save preprocess  
>  
> Github https://github.com/jsoverson/preprocess  
>  

> [!TIP]
> In file build.js Change:  
> const device = 'LS001';  - WHERE LS001 is Device Type
> const onNasOrDevice = 'production'; // production || development  
>  

> [!IMPORTANT]
> Build Captive nad index:  
> command: node build  

> [!CAUTION]
> Parameter:
> urlStatus = 'url points to JSON with device status' when is set it will bind Accessory to 5 sec check status interval
```
{
    "POWER": "ON"
}
```
<br><br>  
  
## 💡 Switch
## 🌡️ Temperature and Humidity sensor
## ⚙️ Config example
> [!NOTE]
> Sensor - Read JSON Or MQTT for Temperature, Humidity  
>   


| **Param** 	| **Description** 	| **Param needed** 	|
|---	|---	|:---:	|
| deviceType 	| Sensor or Switch 	| true 	|

<br><br>  
  