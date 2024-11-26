const https = require('https');
const { URL } = require('url');
const { STORY_URL, SPEECH_TO_TEXT_URL } = require('./constants');
const User = require('./users');
const Story = require('./story');
const Utils = require('./utils');
const { Blob } = require('blob-polyfill');
const axios = require('axios');
const { Readable } = require('stream');
const { resolve } = require('path');

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

  // static async generateStoryFromAudio(file, userId, storyId = "") {
  //   console.log('File:', file);
  //   const formData = new FormData();

  //   const blob = new Blob([file.buffer], { type: file.mimetype });
  //   console.log("blob", blob);

  //   formData.append('audio_file', blob, {
  //     filename: file.originalname,
  //     contentType: file.mimetype,
  //   });

  //   console.log("form type", formData);
  //   console.log("form type", file.mimetype);

  //   let userTranscription = '';

  //   return new Promise((resolve, reject) => {
  //     try {
  //       const url = new URL(SPEECH_TO_TEXT_URL);

  //       const options = {
  //         hostname: url.hostname,
  //         path: url.pathname,
  //         method: 'POST',
  //         family: 4,
  //         timeout: 30000,
  //         headers: { 
  //           ...formData.getHeaders(),
  //           'Content-Length': formData.getLengthSync(),
  //         },
  //       };

  //       const request = https.request(options, (response) => {
  //         let data = '';

  //         response.on('data', (chunk) => {
  //           data += chunk;
  //         });

  //         response.on('end', async () => {
  //           if (response.statusCode === 200) {
  //             try {
  //               const responseData = JSON.parse(data);
  //               userTranscription = responseData.transcription;
  //               console.log('Transcription:', userTranscription);
  //               resolve(StoryGenerator.generateStory(userTranscription, userId, storyId));
  //             } catch (err) {
  //               console.error('Error:', err);
  //               reject(new Error('Error processing transcript'));
  //             }
  //           } else {
  //             console.error('Error generating transcript:', data);
  //             reject(new Error('Error generating transcript'));
  //           }
  //         });
  //       });

  //       request.on('error', (err) => {
  //         console.error('Error generating transcript:', err);
  //         reject(new Error('Server error'));
  //       });

  //       request.write(blob);
  //       request.end();
  //       // formData.pipe(request);

  //       // request.end();
  //     } catch (err) {
  //       console.error('Error generating transcript:', err);
  //       reject(new Error('Error generating transcript'));
  //     }
  //   });
  // }

  static async generateStoryFromAudio(file, userId, storyId = "") {
    return new Promise((resolve, reject) => {
      try {

        console.log('Buffer length:', file.buffer?.length);

        const formData = new FormData();
        const blob = new Blob([file.buffer], { type: 'audio/wav' });

        // formData.append('audio_file', file.buffer, {
        //   filename: 'file.wav',
        //   contentType: file.mimetype,
        // });

        formData.append('audio_file', blob, 'file.wav');

        console.log('Blob:', blob);
        // console.log('Form Data:', formData);
        // formData.append('audio_file', blob, file.originalname);

        axios({
          method: 'post',
          url: SPEECH_TO_TEXT_URL,
          data: formData,
          family: 4,
        }).then(async (response) => {
          const userTranscription = response.data.transcription;
          console.log('Transcription:', userTranscription);
          const story = await StoryGenerator.generateStory(userTranscription, userId, storyId);
          console.log("Inside audio story generate", story);
          resolve(story);
        })

      } catch (err) {
        console.error('Error generating transcript:', err);
        reject(new Error('Error generating transcript'));
      }
    });
  }
}

module.exports = StoryGenerator;