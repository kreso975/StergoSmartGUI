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

var finalBuildMessage = '';

//
// Read settings.inc file
//
const settingsContent = readFileSync('settings.ini', 'utf-8');

// Parse settings.ini content [String, number, boolean, array like]
const settings = {};
settingsContent.split('\n').forEach(line => {
    const [key, value] = line.split('=').map(item => item.trim());
    if (key && value) {
        if (value.startsWith('[') && value.endsWith(']')) {
            // Parse array-like structure
            try {
                settings[key] = JSON.parse(value);
            } catch (error) {
                settings[key] = value.slice(1, -1).split(',').map(item => item.trim());
            }
        } else if (value.startsWith('{') && value.endsWith('}')) {
            // Parse object-like structure
            settings[key] = JSON.parse(value);
        } else if (value === 'true' || value === 'false') {
            settings[key] = value === 'true';
        } else if (!isNaN(value)) {
            settings[key] = Number(value);
        } else {
            settings[key] = value.replace(/"/g, '');
        }
    }
});


//
// Assign parsed values to variables
//
const device = settings.device;
const onNasOrDevice = settings.environment;


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


// Preprocess HTML file
const htmlInput = readFileSync('index.html', 'utf8');
const htmlOutput = _preprocess(htmlInput, finalContext, { type: 'html' });

// Preprocess the JavaScript inside <script> tags separately
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
const processedOutput = htmlOutput.replace(scriptRegex, (match, p1) => {
    const processedScript = _preprocess(p1, finalContext, { type: 'js' });
    return `<script>${processedScript}</script>`;
});

writeFileSync('dist/index.html', processedOutput);

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
const gzFilePath = 'dist/data/index.html.gz';
if (existsSync(gzFilePath)) {
    unlinkSync(gzFilePath);
    //console.log('Existing .gz file removed');
    
    finalBuildMessage += '\x1b[32mSuccess: \x1b[0mindex.html : Existing .gz file removed\n';
}

// Compress the HTML file to .gz using 7z with ultra compression
const sevenZipPath = settings.sevenZipPath; // Adjust this path if necessary
const command = `"${sevenZipPath}" a -tgzip -mx=9 dist/data/index.html.gz dist/index.html`;

exec(command, (err, stdout, stderr) => {
    if (err) {
        finalBuildMessage +=`\x1b[31mError: \x1b[0m compressing file: ${err.message}`;
        console.error(stderr);
        return;
    }
    //console.log('File compressed successfully with ultra compression');
    //console.log(stdout);
    finalBuildMessage += '\x1b[32mSuccess: \x1b[0mindex.html : File compressed successfully with ultra compression\n';
});

//console.log('Index.html Build complete!');
finalBuildMessage += '\x1b[32mSuccess: \x1b[0mindex.html : Build complete!\n';

// Preprocess HTML file
const htmlInput2 = readFileSync('captive.html', 'utf8');
const htmlOutput2 = _preprocess(htmlInput2, finalContext, { type: 'html' });

// Preprocess the JavaScript inside <script> tags separately
const processedOutput2 = htmlOutput2.replace(scriptRegex, (match, p1) => {
    const processedScript = _preprocess(p1, finalContext, { type: 'js' });
    return `<script>${processedScript}</script>`;
});

writeFileSync('dist/captive.html', processedOutput2);

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
const gzFilePath2 = 'dist/data/captive.html.gz';
if (existsSync(gzFilePath2)) {
    unlinkSync(gzFilePath2);
    //console.log('Existing .gz file removed');
    finalBuildMessage += '\x1b[32mSuccess: \x1b[0mcaptive.html : Existing .gz file removed\n';
}

// Compress the HTML file to .gz using 7z with ultra compression
const command2 = `"${sevenZipPath}" a -tgzip -mx=9 dist/data/captive.html.gz dist/captive.html`;

exec(command2, (err, stdout, stderr) => {
    if (err) {
        finalBuildMessage += `\x1b[31mError: \x1b[0m compressing file: ${err.message}`;
        console.error(stderr);
        return;
    }
    //console.log('File compressed successfully with ultra compression');
    //console.log(stdout);
    finalBuildMessage += '\x1b[32mSuccess: \x1b[0mcaptive.html : File compressed successfully with ultra compression\n';
});

//console.log('Captive.html Build complete!');
//console.log('Build complete!');
finalBuildMessage += '\x1b[32mSuccess: \x1b[0mcaptive.html : Build complete!\n';



//
// .ENV ^ Config.json
//

// Function to recursively resolve arrays
function resolveArray(array) {
    return array.flatMap(item => {
        if (Array.isArray(settings[item])) {
            return resolveArray(settings[item]);
        }
        return item;
    });
}

// Check if insertENVvalues is true
let envSettings = {};
if (settings.insertENVvalues === true) {
    // Read .env file
    const envContent = readFileSync('.env', 'utf-8');

    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=').map(item => item.trim());
        if (key && value) {
            if (value.startsWith('[') && value.endsWith(']')) {
                // Parse array-like structure
                envSettings[key] = value.slice(1, -1).split(',').map(item => item.trim());
            } else if (value === 'true' || value === 'false') {
                envSettings[key] = value === 'true';
            } else if (!isNaN(value)) {
                envSettings[key] = Number(value);
            } else {
                envSettings[key] = value.replace(/"/g, '');
            }
        }
    });
}

//
// Check if generateConfigJSON is true
//
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
    writeFileSync('./dist/data/config.json', JSON.stringify(config, null, 2), 'utf-8');
    
    finalBuildMessage += '\x1b[32mSuccess: \x1b[0mconfig.json has been generated!\n';
}

// Log the parsed settings to check if read correctly 
console.log('Parsed settings:', settings);

//
// Check for insertEmptyHistiryJSON and create history.json if true
//
if (settings.insertEmptyHistoryJSON) {
    try {
        const historyJSON = settings.historyJSON;
        writeFileSync('./dist/data/history.json', JSON.stringify(historyJSON, null, 2));
        finalBuildMessage += '\x1b[32mSuccess: \x1b[0mhistory.json file has been created.\n';
    } catch (error) {
        finalBuildMessage += '\x1b[31mError: \x1b[0m writing historyJSON: ' + error.message + '\n';
    }
} else {
    finalBuildMessage += '\x1b[33mInfo: \x1b[0minsertEmptyHistoryJSON is set to false. No file created.\n';
}
//
// Check for insertEmptyLogJSON and create log.json if true
//
if (settings.insertEmptyLogJSON) {
    try {
        const logJSON = settings.logJSON;
        writeFileSync('./dist/data/log.json', JSON.stringify(logJSON, null, 2));
        finalBuildMessage += '\x1b[32mSuccess: \x1b[0mlog.json file has been created.\n\n';
    } catch (error) {
        finalBuildMessage += '\x1b[31mError: \x1b[0m writing logJSON: ' + error.message + '\n';
    }    
} else {
    finalBuildMessage += '\x1b[33mInfo: \x1b[0minsertEmptyLogJSON is set to false. No file created.\n';
}

finalBuildMessage += '\x1b[32mSuccess: \x1b[0mBuild complete!\n';
console.log(finalBuildMessage);



