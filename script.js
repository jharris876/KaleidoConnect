document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileName = document.getElementById('fileName').value;
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('document', file, fileName);

    const endpoint = 'http://localhost:8080/upload?fileName=' + encodeURIComponent(fileName);

    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = 'Hash: ' + data.hash;
    })
    .catch(error => console.error('Error uploading file:', error));
});
