import axios from 'axios';

// Using HTTPS for the API URL to ensure it works properly in a PWA context
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to translate text
export const translateText = async (text, apiKey, model, systemInstruction) => { // Add systemInstruction parameter
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: systemInstruction // Use the passed systemInstruction
          },
          {
            role: 'user',
            content: text
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Language Teacher PWA'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to translate text');
  }
};

// Function to translate image (using base64 encoding)
export const translateImage = async (imageFile, apiKey, model, systemInstruction) => { // Add systemInstruction parameter
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: systemInstruction // Use the passed systemInstruction
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please translate the text in this image to English.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Language Teacher PWA'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error translating image:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to translate image');
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
