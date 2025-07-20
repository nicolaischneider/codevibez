/**
 * Summary calculation utilities for MVVM analysis results
 */

/**
 * Calculate average grade from analysis results
 * @param {Array<{fileName: string, grade: number, comment: string}>} results - Analysis results
 * @returns {number} Average grade rounded to 1 decimal place
 */
function calculateAverageGrade(results) {
    if (!results || results.length === 0) {
        return 0;
    }
    
    const totalGrade = results.reduce((sum, result) => sum + result.grade, 0);
    const average = totalGrade / results.length;
    
    return Math.round(average * 10) / 10; // Round to 1 decimal place
}

module.exports = {
    calculateAverageGrade
};