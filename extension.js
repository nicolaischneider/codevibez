// Import the VS Code extension API
const vscode = require('vscode');
// Import webview content generator
const { getWebviewContent } = require('./src/ui/webview');

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

// This method is called when your extension is deactivated
function deactivate() {}

// Export the functions that VS Code needs
module.exports = {
	activate,
	deactivate
}
