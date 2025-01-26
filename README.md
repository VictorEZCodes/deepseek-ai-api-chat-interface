# AI Chat Interface

A modern, responsive web application for interacting with DeepSeek's AI models. Built with vanilla JavaScript and Tailwind CSS.

## Features

- 💬 Real-time chat interface with AI
- 📁 File upload support for code and text files
- 🤔 Reasoning process display with DeepSeek Reasoner
- 💾 Local storage for chat history
- 📱 Responsive design for mobile and desktop
- ⏹️ Cancel generation capability
- 🔄 Multiple chat sessions management

## Models Supported

- DeepSeek Chat - General purpose conversational AI
- DeepSeek Reasoner - AI model with detailed reasoning process

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-chat-interface.git
cd ai-chat-interface
```

2. Install dependencies
```bash
npm install
```
3. Create a `.env` file in the root directory and add your DeepSeek API key:
```bash
VITE_DEEPSEEK_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```
## Tech Stack
- Vite - Build tool and development server
- Tailwind CSS - Utility-first CSS framework
- Vanilla JavaScript - No framework dependencies
- Local Storage API - For persistent chat history