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
        //Success
        alert('File uploaded successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        //Fail 
        alert('Upload failed: ' + error.message);
    });
});
