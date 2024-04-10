document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Here you could add a message to the page to indicate success.
        alert('File uploaded successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        // Here you would handle an error and possibly display it.
        alert('Upload failed: ' + error.message);
    });
});
