document.addEventListener('DOMContentLoaded', async () => {
  const username = localStorage.getItem('username');

  if (!username) {
    alert('Please login to access the dashboard.');
    window.location.href = 'login.html';
    return;
  }

  // Fetch profile and check completeness
  try {
    const response = await fetch(`http://localhost:8081/api/user/profile/${username}`);
    const result = await response.json();

    if (!result.firstName || !result.lastName || !result.phone || !result.email || !result.address) {
      window.location.href = 'profile.html';
      return;
    }
  } catch (error) {
    console.error('Error checking profile:', error);
  }

  // Set initial UI
  document.getElementById('accountBtn').textContent = username.charAt(0).toUpperCase();
  document.getElementById('username').textContent = username;

  // Toggle dropdown
  document.getElementById('accountBtn').addEventListener('click', () => {
    const dropdown = document.getElementById('accountDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Navigation links
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });

  document.getElementById('profileLink').addEventListener('click', () => {
    window.location.href = 'profile.html';
  });

  document.getElementById('historyLink').addEventListener('click', () => {
    window.location.href = 'user_complaints_history.html';
  });

  // Hide dropdown on outside click
  window.addEventListener('click', (e) => {
    if (!e.target.matches('#accountBtn')) {
      const dropdown = document.getElementById('accountDropdown');
      if (dropdown && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      }
    }
  });

  // Complaint dropdown logic
  const serviceType = document.getElementById('serviceType');
  const issueType = document.getElementById('issueType');
  const issueTypeGroup = document.getElementById('issueTypeGroup');
  const otherIssueGroup = document.getElementById('otherIssueGroup');

  const issueOptions = {
    'Garbage': ['Garbage not collected', 'Overflowing bins', 'Improper disposal', 'Other'],
    'Electricity': ['Street light issue', 'Short circuit', 'Power outage', 'Meter problem', 'Other'],
    'Water': ['No water supply', 'Low pressure', 'Leakage', 'Contaminated water', 'Other'],
    'Road': ['Potholes', 'Road block', 'Accident zone', 'Illegal parking', 'Other'],
    'Drainage': ['Blocked drains', 'Overflow', 'Bad smell', 'Stagnant water', 'Other'],
    'Internet': ['Public WiFi not working', 'Low speed', 'No coverage', 'Other'],
    'Noise': ['Loud music', 'Vehicle horns', 'Construction noise', 'Other'],
    'Stray Animals': ['Dogs issue', 'Monkeys issue', 'Cattle on road', 'Other']
  };

  serviceType.addEventListener('change', () => {
    const selectedService = serviceType.value;
    issueType.innerHTML = '<option value="">-- Select Problem --</option>';
    otherIssueGroup.style.display = 'none';

    if (selectedService && selectedService !== 'Other') {
      issueOptions[selectedService].forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        issueType.appendChild(option);
      });
      issueTypeGroup.style.display = 'block';
    } else if (selectedService === 'Other') {
      issueTypeGroup.style.display = 'none';
      otherIssueGroup.style.display = 'block';
    } else {
      issueTypeGroup.style.display = 'none';
    }
  });

  issueType.addEventListener('change', () => {
    otherIssueGroup.style.display = issueType.value === 'Other' ? 'block' : 'none';
  });

  // Handle complaint form submission
  document.getElementById('complaintForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const service = serviceType.value;
    const issue = issueType.value;
    const otherIssue = document.getElementById('otherIssue').value.trim();
    const additionalDesc = document.getElementById('additionalDesc').value.trim();

    if (!service) return alert('Please select a service category.');
    let finalIssue = '';

    if (service === 'Other' || issue === 'Other') {
      if (!otherIssue) return alert('Please describe your problem.');
      finalIssue = otherIssue;
    } else {
      finalIssue = issue;
    }

    if (!finalIssue) return alert('Please select a problem type or enter one.');
    if (!additionalDesc) return alert('Please provide additional description.');

    try {
      const response = await fetch('http://localhost:8081/api/complaints', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          serviceType: service,
          issueType: finalIssue,
          additionalDesc: additionalDesc
        })
      });

      const result = await response.json();
      document.getElementById('statusMsg').textContent = result.message;

      this.reset();
      issueTypeGroup.style.display = 'none';
      otherIssueGroup.style.display = 'none';

    } catch (error) {
      console.error(error);
      document.getElementById('statusMsg').textContent = 'Error submitting complaint.';
    }
  });
});
