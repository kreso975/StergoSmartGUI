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

<br><br>
  
  
## 💡 Switch
> [!NOTE]
> For compiling GUI in order to optimize code and code size, it is required to install node module preprocess https://www.npmjs.com/package/preprocess  
> Inside your project repository
> $ npm install --save preprocess
>

> [!TIP]
> How to setup Discord Webhooks: [link](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

> [!IMPORTANT]
> Use HTTP or MQTT not both for same accessory.  
>   
> Parameters required in Config:  
> 
> deviceType = 'Switch',  
> deviceName = 'Name your Accessory',  
> deviceID = 'Put something unique / chars and numbers',  
> urlON = 'URL that triggers your device to change state to ON',  
> urlOFF = 'URL that triggers your device to change state to OFF'

> [!CAUTION]
> Parameter:
> urlStatus = 'url points to JSON with device status' when is set it will bind Accessory to 5 sec check status interval
```
{
    "POWER": "ON"
}
```
<br><br>  
  

## 🌡️ Temperature and Humidity sensor
> [!NOTE]
> Sensor - Read JSON Or MQTT for Temperature, Humidity  
>   

<br>

## ⚙️ Config example

<br><br>

## ⚙️ Config params

| **Param** 	| **Description** 	| **Param needed** 	|
|---	|---	|:---:	|
| deviceType 	| Sensor or Switch 	| true 	|

<br><br>  
  

