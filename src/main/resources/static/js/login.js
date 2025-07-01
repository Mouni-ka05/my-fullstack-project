document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json(); // ✅ parse as JSON

    if (response.ok && result.message.includes("User login successful")) {
      localStorage.setItem('username', result.username);

      if (!result.profileCompleted) {
        window.location.href = 'profile.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    } else {
      alert(result.message || 'Login failed');
    }

  } catch (error) {
    console.error('Login failed:', error);
    alert('Error connecting to server.');
  }
});
