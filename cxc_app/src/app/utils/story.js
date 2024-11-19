import { makeRequest } from './api';

export async function generateStory(prompt) {
  const response = await makeRequest('generate', 'POST', { prompt });
  return response.generated_text;
}
