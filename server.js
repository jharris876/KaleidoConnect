const express = require('express');
const multer = require('multer'); 
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();
const app = express();
app.use(express.static(__dirname));
const upload = multer({ dest: 'uploads/' }); // Files will be temporarily stored in 'uploads' folder

app.get('/', (req, res) => {
    res.sendFile('./main.html', { root: __dirname });
  });

app.post('/upload', upload.single('document'), async (req, res) => {
    const { originalname, path: tempPath } = req.file;
    const { name } = req.body;

    const username = process.env.KALEIDO_USERNAME;
    const password = process.env.KALEIDO_PASSWORD;

    const auth = Buffer.from('${username}:${password}').toString('base64');

    try {
        // Read the file from the temporary path
        const fileData = fs.readFileSync(tempPath);

        const kaleidoResponse = await fetch('https://u0olkijmyq-u0jt57ylcx-connect.us0-aws.kaleido.io/', {
            method: 'POST',
            headers: {
                'Authorization' : 'Basic ${auth}',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                name: name, // Use the file name input from the form
                file: fileData, // Send the file data
            }),
        });

        // Remove the file from the temporary storage
        fs.unlinkSync(tempPath);

        if (!kaleidoResponse.ok) throw new Error(`Kaleido responded with status: ${kaleidoResponse.status}`);

        const kaleidoData = await kaleidoResponse.json();
        res.json(kaleidoData);
    } catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


//Need to use application credentials in kaleido security tab.