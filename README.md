<p align="center">

<img src="https://github.com/kreso975/StergoSmartGUI/blob/main/img/StergoLogo.svg" width="150">

</p>

<span align="center">

### Stergo Smart GUI
# Bootstrap 5 

</span>

<img src="https://img.shields.io/badge/node-^18.20.4%20%7C%7C%20^20.16.0%20%7C%7C%20^22.5.1-brightgreen"> &nbsp;
[![Donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://paypal.me/kreso975)

This is GUI for StergoSmart project running on IoT devices 

<br><br>
  
  
## 💡 Switch
> [!NOTE]
> HTTP - Read Status (On/Off), Turn ON (url), Turn OFF (url)  
> MQTT - Turn ON/OFF | Values: On = 1, Off = 0    
> Discord Webhook publishes switch status to your Discord channel    

> [!TIP]
> If you don't have Manual switch and you don't mind when Homebridge is rebooted, your device is going to be set as OFF
> then you don't have to use Parameter urlStatus. 
>  
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
  

