const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data'); // You will need to install this npm package
const fs = require('fs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('/main.html', { root: __dirname });
});

app.post('/upload', upload.single('document'), async (req, res) => {
  const { originalname, path: tempPath } = req.file;
  const { name } = req.body;
  const username = process.env.KALEIDO_USERNAME;
  const password = process.env.KALEIDO_PASSWORD;

  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    // Create a form-data object
    const formData = new FormData();
    // Append the file data to the form-data
    formData.append('file', fs.createReadStream(tempPath), originalname);

    // Dynamically construct the endpoint URL
    const endpoint = `https://u0olkijmyq-u0alug2exc-documentstore.us0-aws.kaleido.io/api/v1/documents/${encodeURIComponent(name)}`;

    // Send the form-data request to Kaleido API
    const kaleidoResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        ...formData.getHeaders(), // Spreads the form-data headers
      },
      body: formData, // Sends the form-data object
    });

    if (!kaleidoResponse.ok) {
      throw new Error(`Kaleido responded with status: ${kaleidoResponse.status}`);
    }

    const kaleidoData = await kaleidoResponse.json();
    res.json(kaleidoData);
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Remove the temporary file
    fs.unlinkSync(tempPath);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
