# CodeVibez - MVVM Architecture Analyzer

A VS Code extension that analyzes Swift/SwiftUI projects for MVVM architecture compliance and clean code using Claude AI.

## Overview

CodeVibez helps Swift developers maintain clean MVVM architecture by automatically analyzing their code and providing actionable feedback. The extension scans your SwiftUI project, evaluates MVVM separation, and returns detailed grades with improvement suggestions.

## Features

- **Smart Analysis**: Configurable analysis of 1-20 file pairs with intelligent selection
- **MVVM Compliance**: Checks proper separation between Views and ViewModels
- **Grades and Feedback**: Grading and feedback of files and overall summary

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with your Claude API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```
4. Open in VS Code and press F5 to launch extension development host (or press Run > Run Without Debugging)

## Usage

1. Open a Swift/SwiftUI project in VS Code
2. Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
3. Run "CodeVibez: Analyze MVVM Architecture"

## How It Works

1. **File Discovery**: Scans workspace for Swift View and ViewModel files
2. **Smart Selection**: Filters files by line count (80-300) and balances View/ViewModel pairs
3. **Code Compression**: Removes comments, imports, and preview code to reduce token usage
4. **AI Analysis**: Uses Claude Haiku with function calling for detailed MVVM evaluation
5. **Progressive Display**: Shows results in real-time as each file analysis completes
6. **Summary Generation**: Provides overall project grade and recommendations

## Requirements

- VS Code 1.60.0 or higher
- Node.js 14 or higher
- Claude API key from Anthropic

## License

MIT License - see LICENSE file for details