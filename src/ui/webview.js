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
        .results {
            margin: 20px 0;
        }
        .results h2 {
            color: var(--vscode-textLink-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 8px;
        }
        .results h3 {
            color: var(--vscode-foreground);
            margin: 20px 0 10px 0;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-item {
            text-align: center;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border-radius: 4px;
            border: 1px solid var(--vscode-panel-border);
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .stat-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 5px;
        }
        .pairs-list {
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
        }
        .pair-item {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 15px;
            padding: 15px;
            border-bottom: 1px solid var(--vscode-panel-border);
            align-items: center;
        }
        .pair-item:last-child {
            border-bottom: none;
        }
        .pair-item.has-viewmodel {
            background-color: var(--vscode-textBlockQuote-background);
        }
        .pair-item.missing-viewmodel {
            background-color: var(--vscode-inputValidation-warningBackground);
        }
        .view-info, .viewmodel-info {
            min-width: 0;
        }
        .view-info strong, .viewmodel-info strong {
            color: var(--vscode-textLink-foreground);
        }
        .file-path {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            word-break: break-all;
            margin-top: 4px;
        }
        .arrow {
            font-size: 18px;
            text-align: center;
            color: var(--vscode-textLink-foreground);
        }
        .missing {
            color: var(--vscode-inputValidation-warningForeground);
            font-style: italic;
        }
        .selected-files {
            margin: 10px 0;
        }
        .selected-file-item {
            margin: 10px 0;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
        }
        .selected-file-name {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 5px;
        }
        .selected-file-info {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 5px;
        }
        .llm-analysis-section {
            margin: 20px 0;
        }
        .llm-analysis {
            margin: 10px 0;
        }
        .llm-result {
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            margin: 10px 0;
        }
        .llm-grade {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 10px;
        }
        .llm-comment {
            color: var(--vscode-foreground);
            line-height: 1.4;
        }
        .llm-loading {
            color: var(--vscode-descriptionForeground);
            font-style: italic;
            padding: 15px;
            text-align: center;
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

        <div class="results" id="results" style="display: none;">
            <h2>Analysis Results</h2>
            
            <div class="statistics" id="statistics"></div>
            
            <div class="pairs-section">
                <h3>View-ViewModel Pairs</h3>
                <div class="pairs-list" id="pairsList"></div>
            </div>

            <div class="selected-files-section">
                <h3>Selected Files for Analysis</h3>
                <div class="selected-files" id="selectedFiles"></div>
            </div>

            <div class="llm-analysis-section">
                <h3>LLM Analysis Results</h3>
                <div class="llm-analysis" id="llmAnalysis"></div>
            </div>
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
            const results = document.getElementById('results');
            
            // Reset UI
            button.disabled = true;
            button.textContent = 'Analyzing...';
            status.style.display = 'block';
            status.textContent = 'Starting analysis...';
            results.style.display = 'none';
            
            // Send message to extension backend
            vscode.postMessage({
                command: 'analyze'
            });
        }

        /**
         * Display analysis results in the webview
         */
        function displayResults(data) {
            const button = document.getElementById('analyzeBtn');
            const status = document.getElementById('status');
            const results = document.getElementById('results');
            const statistics = document.getElementById('statistics');
            const pairsList = document.getElementById('pairsList');

            // Update button and hide status
            button.disabled = false;
            button.textContent = 'Analyze MVVM Architecture';
            status.style.display = 'none';
            results.style.display = 'block';

            // Display statistics
            const stats = data.statistics;
            statistics.innerHTML = \`
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">\${stats.totalViews}</div>
                        <div class="stat-label">Total Views</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">\${stats.viewsWithViewModels}</div>
                        <div class="stat-label">With ViewModels</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">\${stats.viewsWithoutViewModels}</div>
                        <div class="stat-label">Missing ViewModels</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">\${stats.percentage}%</div>
                        <div class="stat-label">MVVM Compliance</div>
                    </div>
                </div>
            \`;

            // Display pairs
            if (data.pairs.length === 0) {
                pairsList.innerHTML = '<p>No Swift View files found in the workspace.</p>';
            } else {
                const pairsHtml = data.pairs.map(pair => {
                    const hasViewModel = pair.viewModelName !== null;
                    return \`
                        <div class="pair-item \${hasViewModel ? 'has-viewmodel' : 'missing-viewmodel'}">
                            <div class="view-info">
                                <strong>\${pair.viewName}</strong>
                                <div class="file-path">\${pair.viewPath}</div>
                            </div>
                            <div class="arrow">\${hasViewModel ? '→' : '✗'}</div>
                            <div class="viewmodel-info">
                                \${hasViewModel ? 
                                    \`<strong>\${pair.viewModelName}</strong>
                                     <div class="file-path">\${pair.viewModelPath}</div>\` : 
                                    '<span class="missing">No ViewModel</span>'
                                }
                            </div>
                        </div>
                    \`;
                }).join('');
                pairsList.innerHTML = pairsHtml;
            }

            // Display selected files for analysis
            const selectedFiles = document.getElementById('selectedFiles');
            if (data.selectedFiles && data.selectedFiles.length > 0) {
                const selectedHtml = data.selectedFiles.map(file => {
                    const compressionRatio = file.lineCount > 0 ? Math.round(((file.lineCount - file.compressedLines) / file.lineCount) * 100) : 0;
                    return \`
                        <div class="selected-file-item">
                            <div class="selected-file-name">\${file.viewName}</div>
                            <div class="selected-file-info">
                                Original: \${file.lineCount} lines → Compressed: \${file.compressedLines} lines (-\${compressionRatio}%) | 
                                \${file.viewModelName ? \`Paired with \${file.viewModelName}\` : 'No ViewModel'}
                            </div>
                        </div>
                    \`;
                }).join('');
                selectedFiles.innerHTML = selectedHtml;
            } else {
                selectedFiles.innerHTML = '<p>No files selected for analysis (no files found with 80-300 lines).</p>';
            }
        }

        /**
         * Display error message
         */
        function displayError(errorMessage) {
            const button = document.getElementById('analyzeBtn');
            const status = document.getElementById('status');
            
            button.disabled = false;
            button.textContent = 'Analyze MVVM Architecture';
            status.style.display = 'block';
            status.textContent = \`Error: \${errorMessage}\`;
            status.style.borderLeft = '4px solid var(--vscode-errorForeground)';
        }

        /**
         * Show LLM analysis loading state
         */
        function showLlmAnalysisLoading() {
            const llmAnalysis = document.getElementById('llmAnalysis');
            llmAnalysis.innerHTML = '<div class="llm-loading">Analyzing code...</div>';
        }

        /**
         * Display LLM analysis results
         */
        function displayLlmResults(llmData) {
            const llmAnalysis = document.getElementById('llmAnalysis');
            llmAnalysis.innerHTML = \`
                <div class="llm-result">
                    <div class="llm-grade">Grade: \${llmData.grade}/10</div>
                    <div class="llm-comment">\${llmData.comment}</div>
                </div>
            \`;
        }

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'analysisComplete':
                    displayResults(message.data);
                    break;
                case 'analysisError':
                    displayError(message.error);
                    break;
                case 'llmAnalysisStarted':
                    showLlmAnalysisLoading();
                    break;
                case 'llmAnalysisComplete':
                    displayLlmResults(message.data);
                    break;
            }
        });
    </script>
</body>
</html>`;
}

module.exports = {
	getWebviewContent
};