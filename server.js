require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(express.static('KaleidoConnect'));

app.post('/upload', (req, res) => {
    const fileName = req.query.fileName; // Assuming you're passing the file name as a query parameter
    const filePath = `test_${fileName}`;
    const file = req.files.document; // Make sure to use a library like express-fileupload to handle files
    const pathText = req.body.path; // The text value for the 'path' field

    const formData = new FormData();
    formData.append('document', file.data, filePath);
    formData.append('path', pathText);

    const endpoint = `https://u0olkijmyq-u0alug2exc-documentstore.us0-aws.kaleido.io/api/v1/documents/${filePath}`;
    const auth = `Basic ${Buffer.from(`${process.env.KALEIDO_USERNAME}:${process.env.KALEIDO_PASSWORD}`).toString('base64')}`;

    fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': auth
        }
    })
    .then(response => response.json())
    .then(data => {
        res.json({ hash: data.hash });
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
