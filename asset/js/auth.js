const API_URL = 'http://localhost:3000/api';

async function register(email, password, name) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/home.html';
  } else {
    alert(data.error);
  }
}

async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/home.html';
  } else {
    alert(data.error);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login_page.html';
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}
