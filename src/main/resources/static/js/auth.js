// auth.js

// Check if the user is logged in
document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    // If no username found, redirect to login page
    window.location.href = 'login.html';
  }
});

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  }
}
