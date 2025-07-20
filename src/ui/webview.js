/**
 * Webview UI components and content generation for CodeVibez extension
 * Handles the creation of HTML content for the analyzer interface
 */

const { getWebviewStyles } = require('./styles');
const { getWebviewTemplate } = require('./template');
const { getWebviewScripts } = require('./scripts');

/**
 * Generate the HTML content for the webview panel
 * This creates the user interface that will be displayed in the webview
 * @returns {string} HTML content with embedded CSS and JavaScript
 */
function getWebviewContent() {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeVibez MVVM Analyzer</title>
    <style>
        ${getWebviewStyles()}
    </style>
</head>
<body>
    ${getWebviewTemplate()}

    <script>
        ${getWebviewScripts()}
    </script>
</body>
</html>`;
}

module.exports = {
	getWebviewContent
};