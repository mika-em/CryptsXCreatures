import { makeRequest, makeMultipartRequest } from './api';

export async function generateStory(prompt) {
  try {
    const response = await makeRequest('generate', 'POST', { prompt });
    if (response && response.response_plain_text) {
      return response.response_plain_text;
    }
    return 'No response received';
  } catch (error) {
    console.error('Error generating story:', error.message);
    throw new Error(error.message || 'Failed to generate a story.');
  }
}

export async function generateStoryFromAudio(audioBlob) {
  try {
    const response = await makeMultipartRequest('voicegenerate', 'POST', { audioBlob });
    if (response && response.response_plain_text) {
      return response.response_plain_text;
    }
    return 'No response received';
  } catch (error) {
    console.error('Error generating story:', error.message);
    throw new Error(error.message || 'Failed to generate a story.');
  }
}