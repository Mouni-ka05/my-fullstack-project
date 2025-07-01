document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:8081/api/admin/reports');
    const data = await response.json();

    document.getElementById('totalUsers').textContent = data.totalUsers;
    document.getElementById('totalComplaints').textContent = data.totalComplaints;
    document.getElementById('resolvedComplaints').textContent = data.resolvedComplaints;
    document.getElementById('pendingComplaints').textContent = data.pendingComplaints;

  } catch (error) {
    console.error('Error fetching report data:', error);
  }
});
