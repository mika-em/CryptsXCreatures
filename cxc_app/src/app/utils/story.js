import { makeRequest } from './makeRequest';

export async function generateStory(prompt) {
  return makeRequest('generate', 'POST', { prompt });
}
