/**
 * CSS styles for the webview interface
 */

function getWebviewStyles() {
    return `
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
        .llm-file-name {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 8px;
            font-size: 14px;
        }
        .llm-loading {
            color: var(--vscode-descriptionForeground);
            font-style: italic;
            padding: 15px;
            text-align: center;
        }
        .summary-section {
            margin: 30px 0;
            padding: 20px;
            background-color: var(--vscode-textBlockQuote-background);
            border: 2px solid var(--vscode-textLink-foreground);
            border-radius: 8px;
        }
        .summary-grade {
            font-size: 32px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            text-align: center;
            margin-bottom: 15px;
        }
        .summary-text {
            color: var(--vscode-foreground);
            line-height: 1.5;
            text-align: center;
            font-size: 16px;
        }
    `;
}

module.exports = {
    getWebviewStyles
};