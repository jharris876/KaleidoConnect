require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const FormData = require('form-data');
const app = express();
const port = 8080;

app.use(fileUpload());

app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.document;
  const fileName = file.name;
  
  const formData = new FormData();
  formData.append('document', file.data, {
    filename: fileName,
    contentType: file.mimetype,
  });

  //Need to not hardcode auth and make envvars for the user and password.
  const auth = 'Basic ' + Buffer.from(`u0b0mwaoyh:SN8WsPpESZt0Cw-AcxjjGJU17bTd7jWQdAtszjKtOQE`).toString('base64');
  
  const endpoint = `https://u0olkijmyq-u0alug2exc-documentstore.us0-aws.kaleido.io/api/v1/documents/${fileName}`;

  fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': auth,
      ...formData.getHeaders(),
    },
  })
  .then(apiResponse => {
    if (!apiResponse.ok) {
      throw new Error(`Kaleido API responded with status: ${apiResponse.status}`);
    }
    return apiResponse.json();
  })
  .then(data => {
    res.json({ hash: data.hash });
  })
  .catch(error => {
    console.error('Error uploading to Kaleido:', error);
    res.status(500).send(`Error uploading file: ${error.message}`);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
