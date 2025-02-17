/*
* STERGO_PROGRAM :
 *
 * PowerSwitch                  = 0
 * StergoWeather BME280         = 1
 * ticTacToe                    = 2
 * StergoWeather+PowerSwitch    = 3
 * StergoWeather DHT22          = 4
 * StergoWeather DS18B20        = 5

  MODEL_NUMBER "v01" ( ESP8266 default 01S)
  MODEL_NUMBER "v02" ( LOLIN D1 mini)

  Screen or Led On device WS001 = Second 0 == device type
  FE: WS014 = WeatherStation 1 = LED 8x32, 4 = DHT22
*/

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
//const zlib = require('zlib'); //If using node zlib not 7-zip | npm install zlib
import { preprocess as _preprocess } from 'preprocess';
import { exec } from 'child_process';
import SettingsParser from './lib/SettingsParser.js';

var finalBuildMessage = '';

// Initialize settings parser
const settingsParser = new SettingsParser('settings.ini');
const settings = settingsParser.getSettings();

// Check if insertENVvalues is true
let envSettings = {};
if ( settings.insertENVvalues === true ) {
    // Initialize .env parser
    const envParser = new SettingsParser('.env');
    envSettings = envParser.getSettings();
} else {
    finalBuildMessage += '\x1b[33m   Info: \x1b[0m.env SET to false!\n';
}

//
// Assign parsed values to variables
const device = settings.device;
const onNasOrDevice = settings.environment;
const sevenZipPath = settings.sevenZipPath;

// in finalContext we will add all that needs to change
const finalContext = {};

// Preprocess DEVICENAME and DEVICEICON separately
var configDisplayDevices = {
    SC001: { title: "Stergo Core module", icon: "bi-toggles" },
    TT001: { title: "Tic-Tac-Toe module", icon: "bi-toggles" },
    RS001: { title: "Relay Switch module", icon: "bi-toggles" },
    PS001: { title: "Power Switch module", icon: "bi-plugin" },
    LS001: { title: "Light Switch module", icon: "bi-lightbulb-fill" },
    WS014: { title: "Weather Stand Clock", icon: "bi-alarm" }
}

const deviceName = configDisplayDevices[device]?.title || 'Weather Module';
const deviceIcon = configDisplayDevices[device]?.icon || 'bi-question-circle';
const randomNumber = Math.floor(10000000 + Math.random() * 90000000);

finalContext['DEVICENAME'] = `<i class="bi ${deviceIcon}"></i> ${deviceName}`;
finalContext['THEME_STORAGE_NAME'] = `var themeStorageName = '${device}-${randomNumber}';`;

const context = {
    SC001: [onNasOrDevice, 'STERGO_CORE'],
    TT001: [onNasOrDevice, 'STERGO_CORE', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE'],
    RS001: [onNasOrDevice, 'SWITCH', 'MQTT', 'WEBHOOK', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE', 'PUBLISHING'],
    LS001: [onNasOrDevice, 'SWITCH', 'MQTT', 'WEBHOOK', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE', 'PUBLISHING'],
    WS001: [onNasOrDevice, 'WEATHER', 'AIR_PRESSURE', 'MQTT', 'WEBHOOK', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE', 'PUBLISHING'],
    WS003: [onNasOrDevice],
    WS004: [onNasOrDevice, 'WEATHER', 'MQTT', 'WEBHOOK', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE', 'PUBLISHING'],
    WS014: [onNasOrDevice, 'DISPLAY', 'WEATHER', 'MQTT', 'WEBHOOK', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE', 'PUBLISHING'],
    WS011: [onNasOrDevice, 'DISPLAY', 'WEATHER', 'AIR_PRESSURE', 'MQTT', 'WEBHOOK', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE', 'PUBLISHING']
};

// Ensure all context variables are either true or false
const allKeys = ['production', 'development', 'exclude', 'DISPLAY', 'WEATHER', 'AIR_PRESSURE', 'SWITCH', 'STERGO_CORE', 'MQTT', 
            'WEBHOOK', 'DISCORD_WEBHOOK', 'TIC_TAC_TOE', 'PUBLISHING'];

// Set all keys to false initially
allKeys.forEach(key => {
    finalContext[key] = false;
});

// Set the keys from the context arrays to true
context[device].forEach(key => {
    finalContext[key] = true;
});

//
// Render index.html and captive.html
function preprocessAndCompress(inputFile, outputFile, gzFilePath) {
    // Read and preprocess HTML file
    const htmlInput = readFileSync(inputFile, 'utf8');
    const htmlOutput = _preprocess(htmlInput, finalContext, { type: 'html' });

    // Preprocess the JavaScript inside <script> tags separately
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    const processedOutput = htmlOutput.replace(scriptRegex, (match, p1) => {
        const processedScript = _preprocess(p1, finalContext, { type: 'js' });
        return `<script>${processedScript}</script>`;
    });

    writeFileSync(outputFile, processedOutput);
    /* IF USING Node ZLIB
    // Compress the HTML file to .gz using zlib with ultra compression
    const gzip = zlib.createGzip({ level: 9 });
    const input = fs.createReadStream('dist/index.html');
    const output = fs.createWriteStream('dist/index.html.gz');

    input.pipe(gzip).pipe(output).on('finish', () => {
        console.log('File compressed successfully with ultra compression');
    });
    */

    // Check if the .gz file exists and remove it
    if (existsSync(gzFilePath)) {
        unlinkSync(gzFilePath);
        //console.log('Existing .gz file removed');
        finalBuildMessage += `\x1b[32mSuccess: \x1b[0m${inputFile} : Existing .gz file removed\n`;
    }

    // Compress the HTML file to .gz using 7z with ultra compression
    const command = `"${sevenZipPath}" a -tgzip -mx=9 ${gzFilePath} ${outputFile}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            finalBuildMessage +=`\x1b[31mError: \x1b[0m compressing file: ${err.message}`;
            console.error(stderr);
            return;
        }
        //console.log('File compressed successfully with ultra compression');
        //console.log(stdout);
        finalBuildMessage += `\x1b[32mSuccess: \x1b[0m${inputFile} : File compressed successfully with ultra compression\n`;
    });

    //console.log('Index.html Build complete!');
    finalBuildMessage += `\x1b[32mSuccess: \x1b[0m${inputFile} : Build complete!\n`;
}

settings.inputFiles.forEach(inputFile => {
    const outputFile = `${settings.pathToRender}/${inputFile}`;
    const gzFilePath = `${settings.pathToRender}/data/${inputFile}.gz`;
    preprocessAndCompress(inputFile, outputFile, gzFilePath);
});


// Function to recursively resolve arrays
function resolveArray(array) {
    return array.flatMap(item => {
        if (Array.isArray(settings[item])) {
            return resolveArray(settings[item]);
        }
        return item;
    });
}

//
// Check if generateConfigJSON is true
if (settings.generateConfigJSON === true) {
    const device = settings.device;
    const configJSON = settings[`configJSON_${device}`] || settings.configJSON_SC001;

    // Resolve the configJSON array
    const resolvedConfigJSON = resolveArray(configJSON);

    // Generate JSON object
    const config = {};
    resolvedConfigJSON.forEach(key => {
        config[key] = envSettings[key] || settings[key];
    });

    // Save JSON object to config.json
    writeFileSync(`${settings.pathToRender}/data/${settings.configFile}`, JSON.stringify(config, null, 2), 'utf-8');
    finalBuildMessage += `\x1b[32mSuccess: \x1b[0m${settings.configFile} has been generated!\n`;
} else {
    finalBuildMessage += `\x1b[33m   Info: \x1b[0mGenerate Config SET to false!\n`;
}

// Log the parsed settings to check if read correctly 
// console.log('Parsed settings:', settings);

// fileName == filename, emptyJSON == content from settings.ini 
function insertEmptyJSONFile( fileName, emptyJSON ) {
    try {
        writeFileSync(`${settings.pathToRender}/data/${fileName}`, JSON.stringify(emptyJSON, null, 2));
        finalBuildMessage += `\x1b[32mSuccess: \x1b[0m${fileName} file has been created.\n`;
    } catch (error) {
        finalBuildMessage += `\x1b[31mError: \x1b[0m writing ${fileName}: ` + error.message + `\n`;
    }
}

// Check for insertEmptyHistiryJSON and create history.json if true
if (settings.insertEmptyHistoryJSON)
    insertEmptyJSONFile(settings.historyFile, settings.historyJSON);
else
    finalBuildMessage += '\x1b[33m   Info: \x1b[0minsert Empty History JSON is SET to false. No file created.\n';

// Check for insertEmptyLogJSON and create log.json if true
if (settings.insertEmptyLogJSON)
    insertEmptyJSONFile(settings.logFile, settings.logJSON);
else
    finalBuildMessage += '\x1b[33m   Info: \x1b[0minsert Empty Log JSON is SET to false. No file created.\n';

finalBuildMessage += '\x1b[32mSuccess: \x1b[0mBuild complete!\n';
console.log(finalBuildMessage);
