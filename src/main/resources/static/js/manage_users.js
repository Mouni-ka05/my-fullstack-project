document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:8081/api/admin/users');
    const users = await response.json();

    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
      return;
    }

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${(user.firstName || '')} ${(user.lastName || '')}</td>
        <td>${user.phone || ''}</td>
        <td>${user.email || ''}</td>
        <td>${user.address || ''}</td>
        <td>
          <button onclick="deleteUser(${user.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading users:', error);
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '<tr><td colspan="6">Error fetching user data.</td></tr>';
  }
});

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const response = await fetch(`http://localhost:8081/api/admin/users/${userId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    alert(result.message);
    location.reload();
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Failed to delete user.');
  }
}
