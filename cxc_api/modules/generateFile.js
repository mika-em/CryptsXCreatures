const fs = require('fs');
const path = require('path');

class GenerateFile {
    static saveAudioFile(req) {
        const uploadDir = path.join(__dirname, 'uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Define the file path
        const filePath = path.join(uploadDir, "file.wav");

        // Write the buffer to a file
        fs.writeFile(filePath, req.file.buffer, (err) => {
            if (err) {
                console.error('Error saving audio file:', err);
            } else {
                console.log('Audio file saved successfully:', filePath);
            }
        });
    }
}

module.exports = GenerateFile;