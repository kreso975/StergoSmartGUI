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

// Compress the HTML file to .gz using 7z
exec('7z a -tgzip dist/index.html.gz dist/index.html', { cwd: 'W:\\' }, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error compressing file: ${err.message}`);
        return;
    }
    console.log('File compressed successfully');
});

console.log('Build complete!');
