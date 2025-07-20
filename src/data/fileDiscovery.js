/**
 * File discovery module for finding Swift Views and ViewModels
 * Uses VS Code's built-in workspace APIs for efficient file discovery
 */

const vscode = require('vscode');
const path = require('path');

/**
 * Find all View files in the workspace using VS Code's file search API
 * @returns {Promise<vscode.Uri[]>} Array of View file URIs
 */
async function findViewFiles() {
    return await vscode.workspace.findFiles('**/*View.swift');
}

/**
 * Find all ViewModel files in the workspace using VS Code's file search API
 * @returns {Promise<vscode.Uri[]>} Array of ViewModel file URIs
 */
async function findViewModelFiles() {
    return await vscode.workspace.findFiles('**/*ViewModel.swift');
}

/**
 * Extract the base name from a View or ViewModel file URI
 * For example: "UserProfileView.swift" -> "UserProfile"
 * @param {vscode.Uri} fileUri - URI of the Swift file
 * @param {string} suffix - The suffix to remove ("View" or "ViewModel")
 * @returns {string} The base name
 */
function getBaseName(fileUri, suffix) {
    const fileName = path.basename(fileUri.fsPath, '.swift');
    if (fileName.endsWith(suffix)) {
        return fileName.slice(0, -suffix.length);
    }
    return fileName;
}

/**
 * Match View files with their corresponding ViewModel files
 * @param {vscode.Uri[]} viewFiles - Array of View file URIs
 * @param {vscode.Uri[]} viewModelFiles - Array of ViewModel file URIs
 * @returns {Array<{view: vscode.Uri, viewModel?: vscode.Uri}>} Array of View-ViewModel pairs
 */
function matchViewsWithViewModels(viewFiles, viewModelFiles) {
    const pairs = [];
    
    // Create a map of base names to ViewModel files for quick lookup
    const viewModelMap = new Map();
    viewModelFiles.forEach(vmUri => {
        const baseName = getBaseName(vmUri, 'ViewModel');
        viewModelMap.set(baseName, vmUri);
    });
    
    // Match each View with its corresponding ViewModel
    viewFiles.forEach(viewUri => {
        const baseName = getBaseName(viewUri, 'View');
        const viewModelUri = viewModelMap.get(baseName);
        
        pairs.push({
            view: viewUri,
            viewModel: viewModelUri || null
        });
    });
    
    return pairs;
}

/**
 * Discover all View-ViewModel pairs in the current workspace
 * @returns {Promise<Array<{view: vscode.Uri, viewModel?: vscode.Uri}>>} Array of View-ViewModel pairs
 */
async function discoverViewViewModelPairs() {
    try {
        // Check if workspace is available
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new Error('No workspace folder is open');
        }
        
        console.log(`Scanning Swift files in workspace: ${workspaceFolders[0].name}`);
        
        // Use VS Code's efficient file search API
        const [viewFiles, viewModelFiles] = await Promise.all([
            findViewFiles(),
            findViewModelFiles()
        ]);
        
        console.log(`Found ${viewFiles.length} View files:`);
        viewFiles.forEach(uri => console.log(`  - ${path.basename(uri.fsPath)}`));
        
        console.log(`Found ${viewModelFiles.length} ViewModel files:`);
        viewModelFiles.forEach(uri => console.log(`  - ${path.basename(uri.fsPath)}`));
        
        // Match Views with ViewModels
        const pairs = matchViewsWithViewModels(viewFiles, viewModelFiles);
        
        console.log(`\nView-ViewModel pairs:`);
        pairs.forEach((pair, index) => {
            const viewName = path.basename(pair.view.fsPath);
            const viewModelName = pair.viewModel ? path.basename(pair.viewModel.fsPath) : 'No ViewModel';
            console.log(`  ${index + 1}. ${viewName} -> ${viewModelName}`);
        });
        
        return pairs;
        
    } catch (error) {
        console.error('Error discovering View-ViewModel pairs:', error);
        throw error;
    }
}

module.exports = {
    findViewFiles,
    findViewModelFiles,
    matchViewsWithViewModels,
    discoverViewViewModelPairs,
    getBaseName
};