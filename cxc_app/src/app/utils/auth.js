import API from '../constants/api';

async function makeRequest(endpoint, method, data) {
  const res = await fetch(`${API}/${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error.message || 'Request failed');
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }

  return res.text();
}

export async function login({ email, password }) {
  return makeRequest('login', 'POST', { email, password });
}

export async function register({
  email,
  password,
  recoveryQuestion,
  recoveryAnswer,
}) {
  console.log({
    email,
    password,
    recoveryQuestion,
    recoveryAnswer,
  });
  return makeRequest('register', 'POST', {
    email,
    password,
    recovery_question: recoveryQuestion,
    recovery_answer: recoveryAnswer,
  });
}
