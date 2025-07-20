/**
 * Statistics calculation module for MVVM analysis
 */

const path = require('path');

/**
 * Calculate statistics from View-ViewModel pairs
 * @param {Array<{view: vscode.Uri, viewModel?: vscode.Uri}>} pairs - Array of View-ViewModel pairs
 * @returns {Object} Statistics and formatted data for display
 */
function calculateAnalysisStatistics(pairs) {
    // Calculate statistics
    const totalViews = pairs.length;
    const viewsWithViewModels = pairs.filter(pair => pair.viewModel !== null).length;
    const viewsWithoutViewModels = totalViews - viewsWithViewModels;
    const percentage = totalViews > 0 ? Math.round((viewsWithViewModels / totalViews) * 100) : 0;
    
    // Format pairs for display
    const formattedPairs = pairs.map(pair => ({
        viewName: path.basename(pair.view.fsPath),
        viewModelName: pair.viewModel ? path.basename(pair.viewModel.fsPath) : null,
        viewPath: pair.view.fsPath,
        viewModelPath: pair.viewModel ? pair.viewModel.fsPath : null
    }));
    
    return {
        pairs: formattedPairs,
        statistics: {
            totalViews,
            viewsWithViewModels,
            viewsWithoutViewModels,
            percentage
        }
    };
}

module.exports = {
    calculateAnalysisStatistics
};