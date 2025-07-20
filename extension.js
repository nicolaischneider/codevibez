// Import the VS Code extension API
const vscode = require('vscode');

/**
 * This function is called when the extension is activated
 * Activation happens when a Swift file is opened (see package.json activationEvents)
 * @param {vscode.ExtensionContext} context - The extension context provided by VS Code
 */
function activate(context) {
	console.log('CodeVibez extension is now active!');

	// Register the "Analyze MVVM Architecture" command
	// This command ID must match what's defined in package.json
	const disposable = vscode.commands.registerCommand('codevibez.analyzeArchitecture', function () {
		// Create a new webview panel (a custom UI window within VS Code)
		const panel = vscode.window.createWebviewPanel(
			'codeVibezAnalyzer',  // Unique identifier for this webview type
			'CodeVibez - MVVM Architecture Analyzer',  // Title shown in the tab
			vscode.ViewColumn.One,  // Show in the first editor column
			{
				enableScripts: true  // Allow JavaScript to run in the webview
			}
		);

		// Set the HTML content for our webview panel
		panel.webview.html = getWebviewContent();

		// Listen for messages sent from the webview (like button clicks)
		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'analyze':
						// This will be triggered when user clicks the Analyze button
						// For now, just show a placeholder message
						vscode.window.showInformationMessage('Analysis functionality will be implemented soon!');
						return;
				}
			},
			undefined,
			context.subscriptions  // Ensure proper cleanup when extension deactivates
		);
	});

	// Register the command with VS Code so it can be cleaned up properly
	context.subscriptions.push(disposable);
}

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

// This method is called when your extension is deactivated
function deactivate() {}

// Export the functions that VS Code needs
module.exports = {
	activate,
	deactivate
}
