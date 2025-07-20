/**
 * File selection module for MVVM analysis
 * Handles smart selection of View files and code extraction
 */

const vscode = require('vscode');
const fs = require('fs').promises;

/**
 * Count lines in a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<number>} Number of lines in the file
 */
async function countLines(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        return content.split('\n').length;
    } catch (error) {
        return 0;
    }
}

/**
 * Filter View-ViewModel pairs by line count (80-300 lines)
 * @param {Array<{view: vscode.Uri, viewModel?: vscode.Uri}>} pairs - Array of View-ViewModel pairs
 * @returns {Promise<Array<{view: vscode.Uri, viewModel?: vscode.Uri, lineCount: number}>>} Filtered pairs with line counts
 */
async function filterPairsByLineCount(pairs) {
    const filteredPairs = [];
    
    for (const pair of pairs) {
        const lineCount = await countLines(pair.view.fsPath);
        if (lineCount >= 80 && lineCount <= 300) {
            filteredPairs.push({
                ...pair,
                lineCount
            });
        }
    }
    
    return filteredPairs;
}

/**
 * Smart selection of files for analysis
 * @param {Array<{view: vscode.Uri, viewModel?: vscode.Uri, lineCount: number}>} filteredPairs - Filtered pairs
 * @param {number} maxFiles - Maximum number of files to select (default 4)
 * @returns {Array<{view: vscode.Uri, viewModel?: vscode.Uri, lineCount: number}>} Selected pairs
 */
function selectFilesForAnalysis(filteredPairs, maxFiles = 4) {
    const withViewModels = filteredPairs.filter(pair => pair.viewModel !== null);
    const withoutViewModels = filteredPairs.filter(pair => pair.viewModel === null);
    
    const selected = [];
    
    // Try to get balanced selection (roughly half with ViewModels, half without)
    const targetWithVM = Math.min(Math.floor(maxFiles / 2), withViewModels.length);
    const targetWithoutVM = Math.min(Math.floor(maxFiles / 2), withoutViewModels.length);
    
    // Add files with ViewModels
    for (let i = 0; i < targetWithVM; i++) {
        selected.push(withViewModels[i]);
    }
    
    // Add files without ViewModels
    for (let i = 0; i < targetWithoutVM; i++) {
        selected.push(withoutViewModels[i]);
    }
    
    // If we have less than maxFiles total, fill up with remaining files
    const remaining = maxFiles - selected.length;
    if (remaining > 0) {
        const allRemaining = [...withViewModels.slice(targetWithVM), ...withoutViewModels.slice(targetWithoutVM)];
        for (let i = 0; i < Math.min(remaining, allRemaining.length); i++) {
            selected.push(allRemaining[i]);
        }
    }
    
    return selected;
}

/**
 * Clean Swift code by removing comments, imports, empty lines, and everything after #Preview
 * @param {string} code - Raw Swift code
 * @returns {string} Cleaned Swift code
 */
function cleanSwiftCode(code) {
    const lines = code.split('\n');
    const cleanedLines = [];
    
    for (let line of lines) {
        const trimmed = line.trim();
        
        // Stop processing if we hit a #Preview line
        if (trimmed.startsWith('#Preview')) {
            break;
        }
        
        // Skip empty lines
        if (trimmed === '') continue;
        
        // Skip import statements
        if (trimmed.startsWith('import ')) continue;
        
        // Skip single-line comments
        if (trimmed.startsWith('//')) continue;
        
        // Remove inline comments but keep the code part
        const commentIndex = line.indexOf('//');
        if (commentIndex !== -1) {
            line = line.substring(0, commentIndex).trimEnd();
            if (line.trim() === '') continue;
        }
        
        cleanedLines.push(line);
    }
    
    return cleanedLines.join('\n');
}

/**
 * Extract and clean code from selected files
 * @param {Array<{view: vscode.Uri, viewModel?: vscode.Uri, lineCount: number}>} selectedPairs - Selected pairs
 * @returns {Promise<Array<{viewName: string, viewCode: string, viewModelName?: string, viewModelCode?: string, lineCount: number, compressedLines: number, viewModelCompressedLines?: number}>>} Extracted code with compression info
 */
async function extractCodeFromSelectedFiles(selectedPairs) {
    const extractedFiles = [];
    
    for (const pair of selectedPairs) {
        try {
            // Read and clean View file
            const viewContent = await fs.readFile(pair.view.fsPath, 'utf8');
            const cleanedViewCode = cleanSwiftCode(viewContent);
            const compressedLines = cleanedViewCode.split('\n').length;
            
            const fileData = {
                viewName: pair.view.fsPath.split('/').pop(),
                viewCode: cleanedViewCode,
                lineCount: pair.lineCount,
                compressedLines: compressedLines
            };
            
            // Read and clean ViewModel file if it exists
            if (pair.viewModel) {
                const viewModelContent = await fs.readFile(pair.viewModel.fsPath, 'utf8');
                const cleanedViewModelCode = cleanSwiftCode(viewModelContent);
                const viewModelCompressedLines = cleanedViewModelCode.split('\n').length;
                
                fileData.viewModelName = pair.viewModel.fsPath.split('/').pop();
                fileData.viewModelCode = cleanedViewModelCode;
                fileData.viewModelCompressedLines = viewModelCompressedLines;
            }
            
            extractedFiles.push(fileData);
        } catch (error) {
            console.error(`Error reading file ${pair.view.fsPath}:`, error);
        }
    }
    
    return extractedFiles;
}

/**
 * Main function to select and extract files for analysis
 * @param {Array<{view: vscode.Uri, viewModel?: vscode.Uri}>} pairs - All View-ViewModel pairs
 * @param {number} maxFiles - Maximum number of files to select (default 4)
 * @returns {Promise<Array<{viewName: string, viewCode: string, viewModelName?: string, viewModelCode?: string, lineCount: number}>>} Selected and extracted files
 */
async function selectAndExtractFilesForAnalysis(pairs, maxFiles = 4) {
    // Filter by line count
    const filteredPairs = await filterPairsByLineCount(pairs);
    
    // Smart selection with dynamic limit
    const selectedPairs = selectFilesForAnalysis(filteredPairs, maxFiles);
    
    // Extract and clean code
    const extractedFiles = await extractCodeFromSelectedFiles(selectedPairs);
    
    return extractedFiles;
}

module.exports = {
    selectAndExtractFilesForAnalysis,
    countLines,
    filterPairsByLineCount,
    selectFilesForAnalysis,
    cleanSwiftCode,
    extractCodeFromSelectedFiles
};