/**
 * HTML template for the webview interface
 */

function getWebviewTemplate() {
    return `
    <div class="container">
        <h1>CodeVibez MVVM Architecture Analyzer</h1>
        
        <div class="description">
            <p>This tool analyzes your SwiftUI project for MVVM architecture compliance using Claude Haiku.</p>
            <p><strong>What it does:</strong></p>
            <ul>
                <li>Scans a fraction of Swift files in your project</li>
                <li>Analyzes MVVM separation (Views, ViewModels)</li>
                <li>Returns a grade (1-10)</li>
                <li>Provides actionable improvement suggestions</li>
            </ul>
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
    `;
}

module.exports = {
    getWebviewTemplate
};