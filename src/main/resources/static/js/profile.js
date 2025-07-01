document.addEventListener('DOMContentLoaded', async () => {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'login.html';
    return;
  }

  const fields = ['firstName', 'lastName', 'phoneNumber', 'email', 'address'];
  const setReadOnly = (readOnly) => {
    fields.forEach(id => {
      document.getElementById(id).readOnly = readOnly;
    });
    document.getElementById('profilePicInput').disabled = readOnly;
    profilePicPreview.style.cursor = readOnly ? 'default' : 'pointer';
  };

  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const profilePicInput = document.getElementById('profilePicInput');
  const profilePicPreview = document.getElementById('profilePicPreview');
  let selectedImageFile = null;

  try {
    const response = await fetch(`http://localhost:8081/api/user/profile/${username}`);
    const result = await response.json();

    // Populate fields
    document.getElementById('firstName').value = result.firstName || '';
    document.getElementById('lastName').value = result.lastName || '';
    document.getElementById('phoneNumber').value = result.phone || '';
    document.getElementById('email').value = result.email || '';
    document.getElementById('address').value = result.address || '';

    // Show image if exists
    if (result.profileImageUrl) {
      profilePicPreview.src = result.profileImageUrl;
    }

    if (result.profileCompleted) {
      setReadOnly(true);
      editBtn.style.display = 'block';
      saveBtn.style.display = 'none';
      saveBtn.textContent = 'Save Changes';
    } else {
      setReadOnly(false);
      editBtn.style.display = 'none';
      saveBtn.style.display = 'block';
      saveBtn.textContent = 'Submit Profile';
    }


  } catch (error) {
    console.error('Error loading profile:', error);
    alert('Failed to load profile.');
  }

  // Enable editing when "Edit" clicked
  editBtn.addEventListener('click', () => {
    setReadOnly(false);
    editBtn.style.display = 'none';
    saveBtn.style.display = 'block';
  });

  // Open file input on image click (only if enabled)
  profilePicPreview.addEventListener('click', () => {
    if (!profilePicInput.disabled) {
      profilePicInput.click();
    }
  });

  profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePicPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Save updated profile
  saveBtn.addEventListener('click', async () => {
    const data = {
      username,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      phone: document.getElementById('phoneNumber').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value
    };

    if (Object.values(data).some(v => !v)) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.text();
      alert(result);
      window.location.href = 'dashboard.html';

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  });
});
