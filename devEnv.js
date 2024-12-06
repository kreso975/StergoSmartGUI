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

const fs = require('fs');
const preprocess = require('preprocess');
const { exec } = require('child_process');

const device = 'WS004';
const onNasOrDevice = 'development'; // production || development

const context = {
    RS001: [onNasOrDevice, 'SWITCH'],
    WS001: [onNasOrDevice],
    WS003: [onNasOrDevice],
    WS004: [onNasOrDevice, 'WEATHER'],
    WS011: [onNasOrDevice, 'DISPLAY', 'WEATHER', 'BME280']
};

// Ensure all context variables are either true or false
const allKeys = ['production', 'development', 'DISPLAY', 'WEATHER','BME280', 'SWITCH'];
const finalContext = {};

// Set all keys to false initially
allKeys.forEach(key => {
    finalContext[key] = false;
});

// Set the keys from the context arrays to true
context[device].forEach(key => {
    finalContext[key] = true;
});

// Preprocess HTML file
const htmlInput = fs.readFileSync('index.html', 'utf8');
const htmlOutput = preprocess.preprocess(htmlInput, finalContext, { type: 'html' });

// Preprocess the JavaScript inside <script> tags separately
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
const processedOutput = htmlOutput.replace(scriptRegex, (match, p1) => {
    const processedScript = preprocess.preprocess(p1, finalContext, { type: 'js' });
    return `<script>${processedScript}</script>`;
});

fs.writeFileSync('dist/index.html', processedOutput);

// Check if the .gz file exists and remove it
const gzFilePath = 'dist/index.html.gz';
if (fs.existsSync(gzFilePath)) {
    fs.unlinkSync(gzFilePath);
    console.log('Existing .gz file removed');
}

// Compress the HTML file to .gz using 7z with ultra compression
const sevenZipPath = '"C:\\Program Files\\7-Zip\\7z.exe"'; // Adjust this path if necessary
const command = `${sevenZipPath} a -tgzip -mx=9 dist/index.html.gz dist/index.html`;

exec(command, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error compressing file: ${err.message}`);
        console.error(stderr);
        return;
    }
    console.log('File compressed successfully with ultra compression');
    console.log(stdout);
});

console.log('Build complete!');
