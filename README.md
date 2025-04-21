# Language Teacher PWA

A Progressive Web App that translates text and images to English using OpenRouter API.

## Features

- Translate text from any language to English
- Upload and translate images containing text
- Works offline (for UI, translation requires internet)
- Installable as a PWA on desktop and mobile devices
- Secure: your API key is stored locally on your device

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the app:
   ```
   npm run build
   ```
4. Start the local server:
   ```
   node server.js
   ```
5. Open your browser to http://localhost:8080

## Using the App

1. Go to Settings and enter your OpenRouter API key
2. Select a model to use for translations
3. Return to the chat interface
4. Type text in any language or upload an image with text
5. Receive translations in English

## Getting an OpenRouter API Key

Visit [OpenRouter](https://openrouter.ai/keys) to create an account and get an API key.

## Available Models

The app includes several popular models:
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku
- Gemini Pro
- GPT-4 Turbo
- GPT-3.5 Turbo
- Mistral Large
- Mistral 7B

You can also enter a custom model identifier if needed.

## Privacy

This app runs entirely in your browser. Your API key and conversations are stored locally on your device and are not sent to any server except OpenRouter for processing translations.
