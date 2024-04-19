const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const app = express();
const port = 8080;

// Middleware to handle file uploads
app.use(fileUpload());

// Middleware to serve static files from the directory where this script is located
app.use(express.static(__dirname));

// Route to serve the main.html page when visiting the site root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

// Upload route
app.post('/upload', (req, res) => {
  // The file is sent with the 'document' key
  const file = req.files.document;
  const fileName = file.name; // Using the original file name
  const filePath = '/v1/documents/' + fileName;

  // Prepare the form data to send to the Kaleido API
  const formData = new FormData();
  formData.append('document', file.data, fileName); // Attach the file data and the name

  const auth = 'Basic ' + Buffer.from(process.env.KALEIDO_USERNAME + ':' + process.env.KALEIDO_PASSWORD).toString('base64');

  const endpoint = 'https://u0olkijmyq-u0alug2exc-documentstore.us0-aws.kaleido.io/api' + filePath;

  // Send the file to the Kaleido API
  fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': auth
    },
  })
  .then(apiResponse => apiResponse.json())
  .then(data => {
    res.json({ hash: data.hash });
  })
  .catch(error => {
    console.error('Error uploading to Kaleido:', error);
    res.status(500).send('Error uploading file');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
