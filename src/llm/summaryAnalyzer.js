/**
 * Summary analysis module for generating overall project vibe check
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Anthropic = require('@anthropic-ai/sdk');
const { summaryAnalysisTool } = require('./toolDefinitions');

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate overall project summary based on individual analysis results
 * @param {Array<{fileName: string, grade: number, comment: string}>} results - Individual file analysis results
 * @param {number} averageGrade - Calculated average grade
 * @returns {Promise<{summary: string}>} Overall project summary
 */
async function generateProjectSummary(results, averageGrade) {
    try {
        // Build summary prompt
        const prompt = `You are analyzing the overall MVVM architecture quality of a Swift project.

INDIVIDUAL FILE ANALYSIS RESULTS:
${results.map((result, index) => 
    `${index + 1}. ${result.fileName} - Grade: ${result.grade}/10
   Comment: ${result.comment}`
).join('\n\n')}

OVERALL AVERAGE GRADE: ${averageGrade}/10

Based on these individual analyses, provide a general vibe check about the project's overall MVVM compliance and code quality. Consider patterns across files, common issues, and overall architectural health.`;

        const content = [{ type: "text", text: prompt }];

        // Call Claude Haiku API
        const response = await anthropic.messages.create({
            model: 'claude-3-5-haiku-latest',
            max_tokens: 1000,
            temperature: 0.1,
            messages: [
                {
                    role: 'user',
                    content: content
                }
            ],
            tools: [summaryAnalysisTool],
            tool_choice: { type: "tool", name: "summarize_project_analysis" }
        });

        // Extract function call result
        const toolUse = response.content.find(content => content.type === 'tool_use');
        
        if (toolUse && toolUse.name === 'summarize_project_analysis') {
            return {
                summary: toolUse.input.summary
            };
        } else {
            throw new Error('No valid function call found in response');
        }

    } catch (error) {
        console.error('Error generating project summary:', error.message);
        return {
            summary: 'Unable to generate project summary due to analysis error.'
        };
    }
}

module.exports = {
    generateProjectSummary
};