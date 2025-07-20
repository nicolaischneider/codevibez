/**
 * Claude LLM integration for MVVM analysis
 * Uses function calling to get structured analysis results
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Anthropic = require('@anthropic-ai/sdk');
const { TEST_PROMPT } = require('./testCall');
const { mvvmAnalysisTool } = require('./toolDefinitions');

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Build analysis prompt with actual Swift files
 * @param {Array<{viewName: string, viewCode: string, viewModelName?: string, viewModelCode?: string}>} selectedFiles - Selected files for analysis
 * @returns {string} Complete prompt for Claude
 */
function buildAnalysisPrompt(selectedFiles) {
    let prompt = `You are an expert Swift/SwiftUI architect analyzing both MVVM compliance AND code quality.
ANALYZE these files for:
1. MVVM Architecture Compliance 
2. General Code Quality & Clean Code Principles

`;

    selectedFiles.forEach((file, index) => {
        prompt += `=== FILE ${index + 1}: ${file.viewName} ===\n`;
        prompt += file.viewCode + '\n\n';
        
        if (file.viewModelCode) {
            prompt += `=== VIEWMODEL: ${file.viewModelName} ===\n`;
            prompt += file.viewModelCode + '\n\n';
        }
    });

    prompt += `EVALUATE against these criteria:

MVVM COMPLIANCE:
- Views: Only UI code, no business logic, no network calls, no data processing
- ViewModels: Handle state, business logic, data transformation, API calls  
- Proper separation: View observes ViewModel, correct @Published/@StateObject usage

CLEAN CODE QUALITY:
- Clear, descriptive naming (functions, variables, types)
- Single Responsibility Principle (functions do one thing)
- Proper function size (not too long/complex)
- No code duplication
- Appropriate comments where needed
- Consistent formatting and style
- Error handling where appropriate

GRADING: A file can have perfect MVVM separation but still get a low grade for poor code quality (unclear naming, massive functions, duplication, etc.)`;

    return prompt;
}

/**
 * Test LLM call with sample data from testCall.js
 * @returns {Promise<{grade: number, comment: string}>} Analysis result
 */
async function testLlmCall() {
    try {
        // Use the test prompt from testCall.js
        const content = [{ type: "text", text: TEST_PROMPT }];

        // Call Claude Haiku API with function tools
        const response = await anthropic.messages.create({
            model: 'claude-3-5-haiku-latest',
            max_tokens: 4000,
            temperature: 0.1,
            messages: [
                {
                    role: 'user',
                    content: content
                }
            ],
            tools: [mvvmAnalysisTool],
            tool_choice: { type: "tool", name: "analyze_mvvm_files" }
        });

        // Extract function call result from Claude's response
        const toolUse = response.content.find(content => content.type === 'tool_use');
        
        if (toolUse && toolUse.name === 'analyze_mvvm_files') {
            // Return the structured data from the function call
            return {
                grade: toolUse.input.grade,
                comment: toolUse.input.comment
            };
        } else {
            throw new Error('No valid function call found in response');
        }

    } catch (error) {
        console.error('Error in LLM analysis:', error.message);
        throw error;
    }
}

/**
 * Analyze selected Swift files using Claude LLM
 * @param {Array<{viewName: string, viewCode: string, viewModelName?: string, viewModelCode?: string}>} selectedFiles - Selected files for analysis
 * @returns {Promise<{grade: number, comment: string}>} Analysis result
 */
async function analyzeMvvmFiles(selectedFiles) {
    try {
        // Build the analysis prompt with actual files
        const prompt = buildAnalysisPrompt(selectedFiles);
        const content = [{ type: "text", text: prompt }];

        // Call Claude Haiku API with function tools
        const response = await anthropic.messages.create({
            model: 'claude-3-5-haiku-latest',
            max_tokens: 4000,
            temperature: 0.1,
            messages: [
                {
                    role: 'user',
                    content: content
                }
            ],
            tools: [mvvmAnalysisTool],
            tool_choice: { type: "tool", name: "analyze_mvvm_files" }
        });

        // Extract function call result from Claude's response
        const toolUse = response.content.find(content => content.type === 'tool_use');
        
        if (toolUse && toolUse.name === 'analyze_mvvm_files') {
            // Return the structured data from the function call
            return {
                grade: toolUse.input.grade,
                comment: toolUse.input.comment
            };
        } else {
            throw new Error('No valid function call found in response');
        }

    } catch (error) {
        console.error('Error in LLM analysis:', error.message);
        throw error;
    }
}

module.exports = {
    testLlmCall,
    analyzeMvvmFiles
};