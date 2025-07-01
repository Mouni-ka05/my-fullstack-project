document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:8081/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const message = await response.text(); // ⬅️ use text, not json
    alert(message);

    if (response.ok && message.includes('Registered')) {
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Registration failed:', error);
    alert('Error connecting to server.');
  }
});

// 🔐 Password strength logic
document.getElementById("password").addEventListener("input", function () {
  const strengthMsg = document.getElementById("strengthMsg");
  const value = this.value;
  let strength = "";

  if (value.length < 6) {
    strength = "Weak (at least 6 characters)";
    strengthMsg.style.color = "red";
  } else if (value.match(/[0-9]/) && value.match(/[A-Za-z]/) && value.length >= 8) {
    strength = "Strong";
    strengthMsg.style.color = "green";
  } else {
    strength = "Medium (add letters & numbers)";
    strengthMsg.style.color = "orange";
  }

  strengthMsg.textContent = strength;
});
