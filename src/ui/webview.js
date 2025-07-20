/**
 * Webview UI components and content generation for CodeVibez extension
 * Handles the creation of HTML content for the analyzer interface
 */

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
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: var(--vscode-textLink-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 10px;
        }
        .description {
            margin: 20px 0;
            line-height: 1.6;
            color: var(--vscode-descriptionForeground);
        }
        .analyze-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 20px 0;
        }
        .analyze-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .analyze-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .status {
            margin: 20px 0;
            padding: 10px;
            border-radius: 4px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CodeVibez MVVM Architecture Analyzer</h1>
        
        <div class="description">
            <p>This tool analyzes your SwiftUI project for MVVM architecture compliance using Claude AI.</p>
            <p><strong>What it does:</strong></p>
            <ul>
                <li>Scans 5-10 key Swift files in your project</li>
                <li>Analyzes MVVM separation (Views, ViewModels, Models)</li>
                <li>Returns a grade (1-10) plus specific violations</li>
                <li>Provides actionable improvement suggestions</li>
            </ul>
            <p><strong>Cost:</strong> $2-5 per analysis</p>
        </div>

        <button class="analyze-button" id="analyzeBtn" onclick="startAnalysis()">
            Analyze MVVM Architecture
        </button>

        <div class="status" id="status" style="display: none;">
            Ready to analyze your Swift project...
        </div>
    </div>

    <script>
        // Get reference to VS Code API for communication
        const vscode = acquireVsCodeApi();

        /**
         * Handle the analyze button click
         * Sends a message to the extension backend to start analysis
         */
        function startAnalysis() {
            const button = document.getElementById('analyzeBtn');
            const status = document.getElementById('status');
            
            // Disable button and show status
            button.disabled = true;
            button.textContent = 'Analyzing...';
            status.style.display = 'block';
            status.textContent = 'Starting analysis...';
            
            // Send message to extension backend
            vscode.postMessage({
                command: 'analyze'
            });
            
            // Re-enable button after a moment (for demo purposes)
            setTimeout(() => {
                button.disabled = false;
                button.textContent = 'Analyze MVVM Architecture';
                status.textContent = 'Analysis complete! (Functionality coming soon)';
            }, 2000);
        }
    </script>
</body>
</html>`;
}

module.exports = {
	getWebviewContent
};