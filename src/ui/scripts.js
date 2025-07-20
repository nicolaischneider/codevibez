/**
 * JavaScript functions for webview interactions
 */

function getWebviewScripts() {
    return `
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
         * Display LLM analysis results for multiple files
         */
        function displayLlmResults(llmResults) {
            const llmAnalysis = document.getElementById('llmAnalysis');
            
            if (Array.isArray(llmResults) && llmResults.length > 0) {
                const resultsHtml = llmResults.map(result => {
                    return \`
                        <div class="llm-result">
                            <div class="llm-file-name">\${result.fileName}\${result.viewModelName ? \` + \${result.viewModelName}\` : ''}</div>
                            <div class="llm-grade">Grade: \${result.grade}/10</div>
                            <div class="llm-comment">\${result.comment}</div>
                        </div>
                    \`;
                }).join('');
                llmAnalysis.innerHTML = resultsHtml;
            } else {
                llmAnalysis.innerHTML = '<div class="llm-loading">No files analyzed</div>';
            }
        }

        /**
         * Display summary results
         */
        function displaySummary(summaryData) {
            const summaryContent = document.getElementById('summaryContent');
            summaryContent.innerHTML = \`
                <div class="summary-grade">Overall Grade: \${summaryData.averageGrade}/10</div>
                <div class="summary-text">\${summaryData.summary}</div>
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
                case 'summaryComplete':
                    displaySummary(message.data);
                    break;
            }
        });
    `;
}

module.exports = {
    getWebviewScripts
};