import { makeRequest, makeMultipartRequest } from './api';

export async function generateStory(prompt, storyId = null) {
  try {
    const payload = storyId ? { prompt, storyId } : { prompt };
    const response = await makeRequest('generate', 'POST', payload);
    if (response && response.response_plain_text) {
      return {
        text: response.response_plain_text,
        callCount: response.callCount,
        storyId: response.storyId,
      };
    }
    return { text: 'No response received', callCount: 0, storyId: null };
  } catch (error) {
    console.error('Error generating story:', error.message);
    throw new Error(error.message || 'Failed to generate a story.');
  }
}

export async function generateStoryFromAudio(prompt) {
  try {
    const response = await makeMultipartRequest('voicegenerate', 'POST', { prompt });
    if (response && response.response_plain_text) {
      return response.response_plain_text;
    }
    return 'No response received';
  } catch (error) {
    console.error('Error generating story:', error.message);
    throw new Error(error.message || 'Failed to generate a story.');
  }
}


export async function getStories() {
  try {
    const response = await makeRequest('stories', 'GET');
    if (Array.isArray(response)) {
      return response;
    }
    console.warn('Unexpected response format:', response);
    return [];
  } catch (error) {
    console.error('Error fetching stories:', error.message);
    throw new Error(error.message || 'Failed to fetch stories.');
  }
}