document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const fileInput = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('document', fileInput); 
  
    
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('result').textContent = 'Hash: ' + data.hash;
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      document.getElementById('result').textContent = 'Error uploading file.';
    });
  });
  