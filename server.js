const path = require('path');
const express = require('express');
const formData = require('form-data');
const fetch = require('node-fetch');
const multer = require('multer');
const app = express();

app.use(express.static('public'));

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'main.html'));
  });

// Endpoint to handle file uploads
app.post('/upload/:filename', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // The name of the input field (i.e. "document") is used to retrieve the uploaded file
  const file = req.file;

  // Create a form-data object
  const form = new formData();
  form.append('file', file.buffer, file.originalname);

  // Setup the authorization header using environment variables
  const headers = {
    'Authorization': 'Basic ' + Buffer.from(process.env.KALEIDO_USERNAME + ':' + process.env.KALEIDO_PASSWORD).toString('base64')
  };

  // Fetch options
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: form,
    redirect: 'follow'
  };

  // The filename is taken from the URL parameter
  const kaleidoEndpoint = `https://u0olkijmyq-u0alug2exc-documentstore.us0-aws.kaleido.io/api/v1/documents/${req.params.filename}`;

  // Send the file to Kaleido
  fetch(kaleidoEndpoint, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      console.log('File uploaded successfully to Kaleido:', result);
      res.status(200).json({ message: 'File uploaded successfully to Kaleido', result });
    })
    .catch(error => {
      console.error('Error uploading file to Kaleido:', error);
      res.status(500).json({ error: error.message });
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
