const { Octokit } = require("@octokit/rest");
const fs = require('fs');
const path = require('path');

// Get the GitHub token from the environment variable
const githubToken = process.env.GITHUB_TOKEN;

// Instantiate Octokit with the provided GitHub token
const octokit = new Octokit({
  auth: githubToken,
});

// Define the repository and file details
const repoOwner = 'your-username'; // GitHub username or organization
const repoName = 'your-repository';  // Repository name
const filePath = 'path/to/your/file/mentor_questionnaire.xlsx'; // Path to the Excel file

// Read the Excel file and encode it in base64
const fileContent = fs.readFileSync(path.resolve(__dirname, filePath));
const base64Content = fileContent.toString('base64');

// Define the commit message and file upload request body
const uploadFile = async () => {
  try {
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: filePath, // Path where you want to upload the file
      message: "Upload mentor questionnaire Excel file", // Commit message
      content: base64Content, // Base64-encoded file content
      branch: 'main', // Specify the branch (main or any other branch)
    });

    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

uploadFile();
