function handleAdminLogin(event) {
  event.preventDefault();

  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  fetch("http://localhost:8081/api/auth/admin-login", { // Correct endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(msg => { throw new Error(msg); });
    }
    return response.json();
  })
  .then(data => {
    if (data.message === "Admin login successful") {
      localStorage.setItem('username', username); // Store admin username
      localStorage.setItem('role', 'ADMIN');
      window.location.href = "admindashboard.html";
    } else {
      alert(data.message || "Invalid admin credentials");
    }
  })
  .catch(error => {
    console.error("Error during login:", error);
    alert("Login request failed: " + error.message);
  });
}
