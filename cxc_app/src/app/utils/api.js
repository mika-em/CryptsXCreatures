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
  const res = await fetch(`${API}/${endpoint}`, options);
  if (!res.ok) {
    let error = 'request failed';
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await res.json();
      error = errorData.message || JSON.stringify(errorData);
    } else {
      error = await res.text();
    }
    throw new Error(error);
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export async function makeMultipartRequest(endpoint, method, data = null) {
  const options = {
    method,
    credentials: 'include',
  };
  if (data && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(data);
  }
  const res = await fetch(`${API}/${endpoint}`, options);
  if (!res.ok) {
    let error = 'request failed';
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await res.json();
      error = errorData.message || JSON.stringify(errorData);
    } else {
    error = await res.text();
    }
    throw new Error(error);
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}
