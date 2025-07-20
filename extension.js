// Import the VS Code extension API
const vscode = require('vscode');
// Import webview content generator
const { getWebviewContent } = require('./src/ui/webview');
// Import file discovery functionality
const { discoverViewViewModelPairs } = require('./src/data/fileDiscovery');
// Import statistics calculation
const { calculateAnalysisStatistics } = require('./src/data/statistics');
// Import file selection
const { selectAndExtractFilesForAnalysis } = require('./src/data/fileSelection');
// Import LLM analysis
const { analyzeBatchWithSummary } = require('./src/llm/batchAnalyzer');

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
							// Get file count from message, default to 4
							const fileCount = message.fileCount || 4;
							
							// Discover View-ViewModel pairs in the current workspace
							console.log('Starting MVVM architecture analysis...');
							const pairs = await discoverViewViewModelPairs();
							
							// Calculate statistics using the data module
							const analysisResults = calculateAnalysisStatistics(pairs);
							
							// Select and extract files for analysis
							const selectedFiles = await selectAndExtractFilesForAnalysis(pairs, fileCount);
							
							// Add selected files to results
							analysisResults.selectedFiles = selectedFiles;
							
							// Send initial results to webview
							panel.webview.postMessage({
								command: 'analysisComplete',
								data: analysisResults
							});
							
							// Start LLM analysis if we have selected files
							if (selectedFiles.length > 0) {
								panel.webview.postMessage({
									command: 'llmAnalysisStarted'
								});
								
								// Analyze all selected files with progressive results
								const analysisWithSummary = await analyzeBatchWithSummary(selectedFiles, (fileResult, completed, total) => {
									// Send individual result immediately when completed
									panel.webview.postMessage({
										command: 'llmFileComplete',
										data: {
											result: fileResult,
											progress: {
												completed,
												total
											}
										}
									});
								});
								
								// Send final completion message
								panel.webview.postMessage({
									command: 'llmAnalysisComplete',
									data: analysisWithSummary.results
								});
								
								// Send summary to webview
								panel.webview.postMessage({
									command: 'summaryComplete',
									data: {
										averageGrade: analysisWithSummary.averageGrade,
										summary: analysisWithSummary.summary
									}
								});
							}
							
						} catch (error) {
							console.error('Error during analysis:', error);
							panel.webview.postMessage({
								command: 'analysisError',
								error: error.message
							});
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
