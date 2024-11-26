const https = require('https');
const { URL } = require('url');
const { STORY_URL, SPEECH_TO_TEXT_URL } = require('./constants');
const User = require('./users');
const Story = require('./story');
const Utils = require('./utils');

class StoryGenerator {
  static async generateStory(prompt, userId, storyId = "") {
    let story;
    if (storyId) {
      story = await Story.getById(storyId);
    } else {
      story = new Story(userId);
    }


    const decomposedContext = storyId ? Utils.hexDecodeText(story.context) : "";
    const promptText = decomposedContext + prompt;
    const data = JSON.stringify({ prompt: promptText });


    return new Promise((resolve, reject) => {
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
          if (response.statusCode === 200) {
            try {
              await User.increaseCallCount(userId);
              const storyData = JSON.parse(responseData);

              const callCount = await User.getCallCount(userId);
              storyData.callCount = callCount;
              if (storyId) {
                await story.updateContext(prompt, storyData.response_plain_text);
                storyData.storyId = storyId;
                storyData.context = decomposedContext;
              } else {
                const newStory = await Story.create(userId, storyData.response_plain_text, prompt);
                storyData.storyId = newStory.insertId;
              }
              resolve(storyData);
            } catch (err) {
              console.error('Error:', err);
              reject(new Error('Error processing story'));
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

  static async generateStoryFromAudio(audio_file, userId, storyId = "") {
    const formData = new FormData();
    formData.append('audio_file', audio_file, 'file');

    const response = await fetch(SPEECH_TO_TEXT_URL, {
      method: 'POST',
      body: formData
    });

    const responseJson = await response.json();

    return generateStory(responseJson.transcription, userId, storyId);
  }
}

module.exports = StoryGenerator;