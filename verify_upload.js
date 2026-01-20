const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
    try {
        // Create dummy files
        fs.writeFileSync('test.jpg', 'dummy image content');
        fs.writeFileSync('test.mp4', 'dummy video content');

        const form = new FormData();
        form.append('title', 'Test Batch Upload');
        form.append('category', 'Landing Page');
        form.append('files', fs.createReadStream('test.jpg'), { filename: 'test.jpg', contentType: 'image/jpeg' });
        form.append('files', fs.createReadStream('test.mp4'), { filename: 'test.mp4', contentType: 'video/mp4' });

        console.log('Uploading files...');
        const response = await axios.post('http://localhost:5001/api/works', form, {
            headers: form.getHeaders()
        });

        console.log('Upload successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

        // Cleanup
        fs.unlinkSync('test.jpg');
        fs.unlinkSync('test.mp4');

    } catch (error) {
        console.error('Upload failed:', error.response ? error.response.data : error.message);
        // Cleanup on error too
        if (fs.existsSync('test.jpg')) fs.unlinkSync('test.jpg');
        if (fs.existsSync('test.mp4')) fs.unlinkSync('test.mp4');
    }
}

testUpload();
