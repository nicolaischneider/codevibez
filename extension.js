// Import the VS Code extension API
const vscode = require('vscode');
// Import webview content generator
const { getWebviewContent } = require('./src/ui/webview');
// Import file discovery functionality
const { discoverViewViewModelPairs } = require('./src/data/fileDiscovery');

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
			async message => {
				switch (message.command) {
					case 'analyze':
						try {
							// Discover View-ViewModel pairs in the current workspace
							console.log('Starting MVVM architecture analysis...');
							const pairs = await discoverViewViewModelPairs();
							
							// Show results in an information message for now
							const pairCount = pairs.length;
							const viewModelCount = pairs.filter(p => p.viewModel).length;
							const unpairedCount = pairCount - viewModelCount;
							
							const message = `Analysis complete! Found ${pairCount} Views, ${viewModelCount} with ViewModels, ${unpairedCount} without ViewModels.`;
							vscode.window.showInformationMessage(message);
							
							// Log detailed results to console
							console.log(`Analysis results: ${pairCount} total Views`);
							console.log(`${viewModelCount} Views have matching ViewModels`);
							console.log(`${unpairedCount} Views are missing ViewModels`);
							
						} catch (error) {
							console.error('Error during analysis:', error);
							vscode.window.showErrorMessage(`Analysis failed: ${error.message}`);
						}
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
