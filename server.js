const https = require('https');  // Built-in Node.js module
const fs = require('fs');        // Built-in Node.js module to handle file system
const path = require('path');    // Built-in Node.js module to handle paths
require('dotenv').config();      // To load environment variables from .env file

// Read the file to upload (make sure the path is correct)
const filePath = 'path/to/your/local/file.xlsx'; // Update with your file path
const fileName = 'mentor_questionnaire.xlsx';    // The name for the file on GitHub
const commitMessage = 'Add mentor questionnaire file';
const branch = 'main';  // The GitHub branch to upload to

// Read the file content and convert it to base64
const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

// GitHub API URL for uploading a file
const apiUrl = `https://api.github.com/repos/your-username/your-repository-name/contents/${fileName}`;

// Prepare the request body
const requestBody = JSON.stringify({
    message: commitMessage,
    content: fileContent,  // The file content in base64 format
    branch: branch
});

// Prepare the HTTP request options
const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/repos/your-username/your-repository-name/contents/${fileName}`,
    method: 'PUT',
    headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js Script', // GitHub requires a User-Agent header
        'Content-Length': Buffer.byteLength(requestBody)
    }
};

// Send the request to GitHub
const req = https.request(options, (res) => {
    let data = '';

    // Listen for response data
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Once the response is complete
    res.on('end', () => {
        if (res.statusCode === 201) {
            console.log('File successfully uploaded to GitHub!');
        } else {
            console.log('Failed to upload file:', data);
        }
    });
});

// Handle request errors
req.on('error', (error) => {
    console.error('Error uploading to GitHub:', error);
});

// Send the request body
req.write(requestBody);

// End the request
req.end();
