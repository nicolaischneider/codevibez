/**
 * Batch analysis module for processing multiple file pairs
 * Handles iteration through selected files and LLM analysis
 */

const { analyzeMvvmFiles } = require('./claudeAnalyzer');

/**
 * Analyze multiple file pairs and return results for each
 * @param {Array<{viewName: string, viewCode: string, viewModelName?: string, viewModelCode?: string}>} selectedFiles - Selected files for analysis
 * @returns {Promise<Array<{fileName: string, viewModelName?: string, grade: number, comment: string}>>} Analysis results for each file
 */
async function analyzeBatch(selectedFiles) {
    const results = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        try {
            // Analyze single file
            const result = await analyzeMvvmFiles([file]);
            results.push({
                fileName: file.viewName,
                viewModelName: file.viewModelName || null,
                grade: result.grade,
                comment: result.comment
            });
        } catch (error) {
            console.error(`Error analyzing ${file.viewName}:`, error);
            results.push({
                fileName: file.viewName,
                viewModelName: file.viewModelName || null,
                grade: 0,
                comment: `Analysis failed: ${error.message}`
            });
        }
    }
    
    return results;
}

module.exports = {
    analyzeBatch
};