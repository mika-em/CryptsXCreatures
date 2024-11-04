const https = require('https');
const { URL } = require('url');
const { STORY_URL } = require('./constants');
const User = require('./users');

class StoryGenerator {
  static generateStory(prompt, email) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ prompt });

      const url = new URL(STORY_URL);

      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        family: 4,
        timeout: 30000,
      };

      const request = https.request(options, (response) => {
        let responseData = '';

        response.on('data', (chunk) => {
          responseData += chunk;
        });

      response.on('end', async () => {
          console.log('Response Data:', responseData);
          if (response.statusCode === 200) {
            try {
              await User.increaseCallCount(email);
              const storyData = JSON.parse(responseData);
              const callCount = await User.getCallCount(email);
              storyData.callCount = callCount;
              resolve(storyData);
            } catch (err) {
              console.error('Error increasing call count:', err);
              reject(new Error('Error increasing call count'));
            }
          } else {
            console.error('Error generating story:', responseData);
            reject(new Error('Error generating story'));
          }
        });
      });

      request.on('error', (err) => {
        console.error('Error generating story:', err);
        reject(new Error('Server error'));
      });

      request.write(data);
      request.end();
    });
  }
}

module.exports = StoryGenerator;