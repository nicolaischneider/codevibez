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

module.exports = {
    mvvmAnalysisTool
};