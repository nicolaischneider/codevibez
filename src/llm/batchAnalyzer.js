/**
 * Batch analysis module for processing multiple file pairs
 * Handles iteration through selected files and LLM analysis
 */

const { analyzeMvvmFiles } = require('./claudeAnalyzer');
const { calculateAverageGrade } = require('../data/summaryCalculator');
const { generateProjectSummary } = require('./summaryAnalyzer');

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

/**
 * Analyze files and generate complete summary with progressive results
 * @param {Array<{viewName: string, viewCode: string, viewModelName?: string, viewModelCode?: string}>} selectedFiles - Selected files for analysis
 * @param {Function} onProgressCallback - Callback function called when each file is completed
 * @returns {Promise<{results: Array, averageGrade: number, summary: string}>} Complete analysis with summary
 */
async function analyzeBatchWithSummary(selectedFiles, onProgressCallback) {
    const results = [];
    
    // Analyze each file individually and report progress
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        try {
            // Analyze single file
            const result = await analyzeMvvmFiles([file]);
            const fileResult = {
                fileName: file.viewName,
                viewModelName: file.viewModelName || null,
                grade: result.grade,
                comment: result.comment
            };
            
            results.push(fileResult);
            
            // Call progress callback with individual result
            if (onProgressCallback) {
                onProgressCallback(fileResult, i + 1, selectedFiles.length);
            }
            
        } catch (error) {
            console.error(`Error analyzing ${file.viewName}:`, error);
            const errorResult = {
                fileName: file.viewName,
                viewModelName: file.viewModelName || null,
                grade: 0,
                comment: `Analysis failed: ${error.message}`
            };
            
            results.push(errorResult);
            
            // Call progress callback with error result
            if (onProgressCallback) {
                onProgressCallback(errorResult, i + 1, selectedFiles.length);
            }
        }
    }
    
    // Calculate average grade
    const averageGrade = calculateAverageGrade(results);
    
    // Generate project summary
    const summaryResult = await generateProjectSummary(results, averageGrade);
    
    return {
        results,
        averageGrade,
        summary: summaryResult.summary
    };
}

module.exports = {
    analyzeBatch,
    analyzeBatchWithSummary
};