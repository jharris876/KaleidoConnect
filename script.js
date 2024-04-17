document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(this);
      const fileInput = document.querySelector('input[type="file"]');
      const fileName = fileInput.files[0].name;
  
      fetch(`http://localhost:8080/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        alert('File uploaded successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Upload failed: ' + error.message);
      });
    });
  });
  