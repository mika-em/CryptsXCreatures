import { API } from '../constants/api';

export async function makeRequest(endpoint, method, data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  if (data && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${API}/${endpoint}`, options);
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let errorMessage = 'Request failed';
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } else {
        errorMessage = await res.text();
      }

      throw new Error(errorMessage);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw new Error(error.message || 'Network or server error occurred.');
  }
}