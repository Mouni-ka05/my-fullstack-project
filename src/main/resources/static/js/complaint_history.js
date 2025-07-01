document.addEventListener('DOMContentLoaded', async () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('Please login first.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:8081/api/complaints/user/${username}`); // 🔄 corrected backend URL
    const complaints = await response.json();

    const historyContainer = document.getElementById('complaintHistory');

    if (complaints.length === 0) {
      historyContainer.innerHTML = '<p>No complaints found.</p>';
      return;
    }

    complaints.forEach(complaint => {
      const card = document.createElement('div');
      card.className = 'complaint-card';

      card.innerHTML = `
        <p><strong>Service Type:</strong> ${complaint.serviceType}</p>
        <p><strong>Issue:</strong> ${complaint.issueType}</p>
        <p><strong>Description:</strong> ${complaint.additionalDesc || '-'}</p> <!-- 🔄 fixed property name -->
        <p><strong>Date:</strong> ${new Date(complaint.date).toLocaleString()}</p>
        <p class="status ${complaint.status === 'Resolved' ? 'resolved' : 'pending'}">
          Status: ${complaint.status}
        </p>
        ${complaint.reply ? `<p><strong>Reply:</strong> ${complaint.reply}</p>` : ''}
      `;

      historyContainer.appendChild(card);
    });

  } catch (error) {
    console.error('Error fetching complaints:', error);
    document.getElementById('complaintHistory').innerHTML = '<p>Failed to load complaints.</p>';
  }
});
