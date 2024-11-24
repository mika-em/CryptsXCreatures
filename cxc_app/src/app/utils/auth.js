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
  return makeRequest('register', 'POST', {
    email,
    password,
    recovery_question: recoveryQuestion,
    recovery_answer: recoveryAnswer,
  });
}

export const recovery = {
  async getQuestion({ email }) {
    return makeRequest(`forgotpassword?email=${email}`, 'GET');
  },
  async verifyAnswer({ email, answer }) {
    return makeRequest('verifyanswer', 'POST', { email, answer });
  },
  async resetPassword({ email, newPassword }) {
    return makeRequest('resetpassword', 'POST', { email, newPassword });
  },
};
