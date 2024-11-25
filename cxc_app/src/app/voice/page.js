'use client';

import { useState, useEffect } from 'react';
import { generateStory, generateStoryFromAudio } from '../utils/story';
import Typewriter from '../components/typewriter';

let audioChunks = [];

export default function StoryPage() {
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('');
    const [recordingInProgress, setRecordingInProgress] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleRecord = () => {
        const recording = !recordingInProgress;
        setRecordingInProgress(recording);
        if (recording) {
            startRecord();
        } else {
            stopRecord();
        }
    };

    const startRecord = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                try {
                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);
                    setMediaStream(stream);

                    recorder.addEventListener('dataavailable', event => {
                        audioChunks = []; // Store only one chunk of audio data
                        audioChunks.push(event.data);
                    });

                    recorder.start();
                } catch (error) {
                    console.error('Error accessing media devices.', error);
                }
            });
    };

    const stopRecord = () => {
        if (mediaRecorder) {
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
            };

            mediaRecorder.stop();
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
        setRecordingInProgress(false);
    };

    const playRecording = () => {
        if (audioBlob) {
            console.log("Playing recording...", audioBlob);
            const audio = new Audio();
            audio.src = URL.createObjectURL(audioBlob);
            audio.play();
        }
    };

    // const uploadRecording = async () => {
    //     setLoading(true);
    //     try {
    //         const formData = new FormData();
    //         formData.append('audio_file', audioBlob, 'file');

    //         const response = await fetch("https://cheryl-lau.com/cxc/api/voicegenerate", {
    //         // const response = await fetch("http://localhost:3000/cxc/api/voicegenerate", {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //             body: formData
    //         });

    //         const responseJson = await response.json();
    //         console.log(responseJson);

    //         // const story = await generateStoryFromAudio(audioBlob);

    //         // const story = await generateStory("Hello, i am testing");
    //         setGeneratedText(story);
    //         setToastMessage('Success!');
    //         setToastType('success');
    //     } catch (err) {
    //         setToastMessage('There was an issue generating the story.');
    //         setToastType('error');
    //         console.log(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const uploadRecording = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('audio_file', audioBlob);
    
            const response = await fetch("https://cheryl-lau.com/cxc/api/voicegenerate", {
                method: 'POST',
                body: formData, // Let the browser set Content-Type
            });
    
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
    
            const responseJson = await response.json();
            setGeneratedText(responseJson.story); // Adjust key based on backend response
            setToastMessage('Success!');
            setToastType('success');
        } catch (err) {
            setToastMessage('There was an issue generating the story.');
            setToastType('error');
            console.error('Error uploading recording:', err);
        } finally {
            setLoading(false);
        }
    };         

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
            <h1 className="text-6xl bg-clip-text glowing-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-bold pb-5 mb-6">
                <Typewriter text="start your journey" delay={100} />
            </h1>
            <div className="flex items-center justify-center space-x-4 w-20">
                <button
                    id="record-button"
                    type="submit"
                    className={`btn w-40 h-40 text-base-content ${recordingInProgress ? 'btn-secondary' : 'btn-primary'} ${loading ? 'btn-disabled' : ''}`}
                    onClick={handleRecord}
                >
                    {loading ? (
                        <span className="loading loading-lg loading-infinity"></span>
                    ) : (
                        recordingInProgress ? 'Stop Recording' : 'Record'
                    )}
                </button>
                {audioBlob && (
                    <button
                        id="record-button"
                        type="submit"
                        className={`btn w-20 h-20 text-base-content btn-primary ${loading ? 'btn-disabled' : ''}`}
                        onClick={playRecording}
                    >
                        {
                            loading ? (
                                <span className="loading loading-lg loading-infinity"></span>
                            ) : (
                                'Play'
                            )}
                    </button>
                )}
            </div>
            {audioBlob && (
                <div className="pt-4">
                    <button
                        id="generate-button"
                        type="submit"
                        className={`btn w-64 h-20 text-base-content space-y-4 btn-primary ${loading ? 'btn-disabled' : ''}`}
                        onClick={uploadRecording}
                    >
                        {
                            loading ? (
                                <span className="loading loading-lg loading-infinity"></span>
                            ) : (
                                'Generate'
                            )}
                    </button>
                </div>
            )}
            {generatedText && (
                <div className="card mt-4 w-1/3 bg-base-100 p-4">
                    <p className="text-base-content text-xl">{generatedText}</p>
                </div>
            )}
            {toastMessage && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center">
                    <div
                        className={`p-2 rounded-md text-center text-sm max-w-xs ${toastType === 'success'
                            ? 'bg-gray-800 text-green-300'
                            : 'bg-gray-800 text-red-300'
                            }`}
                    >
                        <span>{toastMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
