const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const app = express();
const port = 8080;

app.use(fileUpload());

app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.document) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.document;
  const fileName = file.name;
  const filePath = `/v1/documents/${fileName}`;

  const auth = 'Basic ' + Buffer.from(`${process.env.KALEIDO_USERNAME}:${process.env.KALEIDO_PASSWORD}`).toString('base64');
  const endpoint = `https://u0olkijmyq-u0alug2exc-documentstore.us0-aws.kaleido.io/api${filePath}`;

  const formData = new FormData();
  formData.append('document', file.data, fileName);

  fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': auth
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
