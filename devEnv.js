const fs = require('fs');
const preprocess = require('preprocess');
const { exec } = require('child_process');

const context = {
    NODE_ENV: 'development', // Change to 'production' for production build
    MESSAGE: 'Hello, World!'
};

// Preprocess HTML file
const htmlInput = fs.readFileSync('index.html', 'utf8');
const htmlOutput = preprocess.preprocess(htmlInput, context, { type: 'html' });

// Preprocess the JavaScript inside <script> tags separately
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
const processedOutput = htmlOutput.replace(scriptRegex, (match, p1) => {
    const processedScript = preprocess.preprocess(p1, context, { type: 'js' });
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
