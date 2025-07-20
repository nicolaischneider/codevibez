/**
 * Claude function tool definitions for MVVM analysis
 */

const mvvmAnalysisTool = {
    name: "analyze_mvvm_files",
    description: "Analyze Swift View and ViewModel files for MVVM compliance and code quality",
    input_schema: {
        type: "object",
        properties: {
            grade: {
                type: "integer",
                minimum: 1,
                maximum: 10,
                description: "Overall grade combining MVVM compliance and code quality (1=terrible, 10=excellent)"
            },
            comment: {
                type: "string",
                maxLength: 300,
                description: "2 sentences explaining the grade, covering both MVVM architecture and code quality"
            }
        },
        required: ["grade", "comment"]
    }
};

const summaryAnalysisTool = {
    name: "summarize_project_analysis",
    description: "Provide a general vibe check and summary based on all individual file analysis results",
    input_schema: {
        type: "object",
        properties: {
            summary: {
                type: "string",
                maxLength: 200,
                description: "1-2 sentences giving a general vibe check about the overall code quality and MVVM compliance across all analyzed files"
            }
        },
        required: ["summary"]
    }
};

module.exports = {
    mvvmAnalysisTool,
    summaryAnalysisTool
};