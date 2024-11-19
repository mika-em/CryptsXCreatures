import { makeRequest } from './api';

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
