document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileName = document.getElementById('fileName').value;
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('document', file, fileName);

    fetch('/upload?fileName=' + encodeURIComponent(fileName), {
        method: 'POST',
        body: formData // No headers are needed here; the browser will set the correct multipart/form-data boundary.
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = 'Hash: ' + data.hash;
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        document.getElementById('result').textContent = 'Upload failed.';
    });
});
