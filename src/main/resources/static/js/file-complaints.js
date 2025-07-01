document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert("Please login first.");
    window.location.href = 'login.html';
    return;
  }

  const serviceType = document.getElementById('serviceType');
  const issueType = document.getElementById('issueType');
  const issueTypeGroup = document.getElementById('issueTypeGroup');
  const otherIssueGroup = document.getElementById('otherIssueGroup');
  const previewBox = document.getElementById('previewBox');

  const issueOptions = {
    'Garbage': ['Not Collected', 'Overflowing bins', 'Improper disposal', 'Other'],
    'Water': ['No water', 'Leakage', 'Contaminated', 'Low Pressure', 'Other'],
    'Electricity': ['Power outage', 'Street light fused', 'Short circuit', 'Other'],
    'Drainage': ['Blocked drain', 'Overflow', 'Foul smell', 'Other'],
    'Road': ['Potholes', 'Damaged Road', 'Illegal parking', 'Other'],
    'Streetlight': ['Not Working', 'Broken Pole', 'Flickering Light', 'Other'],
    'Stray Animals': ['Dogs', 'Monkeys', 'Cattle on road', 'Other'],
    'Noise': ['Loud music', 'Construction noise', 'Vehicle horns', 'Other']
  };

  // Populate issue types based on service
  serviceType.addEventListener('change', () => {
    const selected = serviceType.value;
    issueType.innerHTML = '<option value="">-- Select Issue --</option>';
    otherIssueGroup.style.display = 'none';

    if (selected && selected !== 'Other') {
      issueOptions[selected].forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        issueType.appendChild(opt);
      });
      issueTypeGroup.style.display = 'block';
    } else if (selected === 'Other') {
      issueTypeGroup.style.display = 'none';
      otherIssueGroup.style.display = 'block';
    } else {
      issueTypeGroup.style.display = 'none';
    }

    updatePreview();
  });

  // Show other issue box if selected
  issueType.addEventListener('change', () => {
    otherIssueGroup.style.display = issueType.value === 'Other' ? 'block' : 'none';
    updatePreview();
  });

  // Real-time preview logic
  function updatePreview() {
    const service = serviceType.value;
    const issue = issueType.value;
    const otherIssue = document.getElementById('otherIssue').value.trim();
    const description = document.getElementById('description').value.trim();
    const houseNo = document.getElementById('houseNo').value.trim();
    const street = document.getElementById('street').value.trim();
    const landmark = document.getElementById('landmark').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();

    const finalIssue = (issue === 'Other' || service === 'Other') ? otherIssue : issue;

    document.getElementById('prevService').textContent = service || '';
    document.getElementById('prevIssue').textContent = finalIssue || '';
    document.getElementById('prevDesc').textContent = description || '';
    document.getElementById('prevAddr').textContent =
      [houseNo, street, landmark, city, pincode].filter(Boolean).join(', ');

    previewBox.style.display = (service || finalIssue || description || city) ? 'block' : 'none';
  }

  // Attach input listeners
  ['serviceType', 'issueType', 'otherIssue', 'description', 'houseNo', 'street', 'landmark', 'city', 'pincode'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updatePreview);
  });

  // Handle form submission
  document.getElementById('complaintForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const service = serviceType.value;
    const issue = issueType.value;
    const otherIssue = document.getElementById('otherIssue').value.trim();
    const description = document.getElementById('description').value.trim();
    const houseNo = document.getElementById('houseNo').value.trim();
    const street = document.getElementById('street').value.trim();
    const landmark = document.getElementById('landmark').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();

    if (!service) return alert("Please select a service category.");
    let finalIssue = '';

    if (service === 'Other' || issue === 'Other') {
      if (!otherIssue) return alert("Please describe your issue.");
      finalIssue = otherIssue;
    } else {
      if (!issue) return alert("Please select an issue type.");
      finalIssue = issue;
    }

    if (!description) return alert("Please provide a description.");
    if (!houseNo || !street || !city || !pincode) {
      return alert("Please fill all required address fields.");
    }

    try {
      const res = await fetch('http://localhost:8081/api/complaints', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          serviceType: service,
          issueType: finalIssue,
          description: description,
          address: {
            houseNo, street, landmark, city, pincode
          }
        })
      });

      const result = await res.json();

      if (result && result.message) {
        window.location.href = 'complaint-success.html';
      } else {
        alert("Something went wrong. Please try again.");
      }

    } catch (err) {
      console.error(err);
      alert("Error submitting complaint.");
    }
  });
});

function goToDashboard() {
  window.location.href = 'dashboard.html';
}
