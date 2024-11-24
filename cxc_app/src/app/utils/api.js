import {API} from "../constants/api"

export async function makeRequest(endpoint, method, data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Ensure cookies are always sent
  };

  if (data && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API}/${endpoint}`, options);

  if (!res.ok) {
    let errorMessage = 'Request failed';
    const contentType = res.headers.get('content-type');
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
    return res.json();
  }

  return res.text();
}