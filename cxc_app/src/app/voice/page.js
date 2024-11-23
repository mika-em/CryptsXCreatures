'use client';

import { useState, useEffect } from 'react';
import { generateStory } from '../utils/story';
import Typewriter from '../components/typewriter';

export default function StoryPage() {
    const [prompt, setPrompt] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('');
    const [recordingInProgress, setRecordingInProgress] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setToastMessage(null);

        try {
            const story = await generateStory(prompt);
            setGeneratedText(story);
            setToastMessage('Success!');
            setToastType('success');
        } catch (err) {
            setToastMessage('There was an issue generating the story.');
            setToastType('error');
        } finally {
            setLoading(false);
        }
    }

    const startRecord = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLoading(true);
        try {
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setMediaStream(stream);
            setRecordingInProgress(true);
            setLoading(false);

            recorder.ondataavailable = (event) => {
                console.log("Data available", event);
                setAudioChunks((prev) => [...prev, event.data]);
            };

            recorder.start();
        } catch (error) {
            console.error('Error accessing media devices.', error);
            setLoading(false);
        }
    };

    const stopRecord = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.onstop = () => {
                console.log('Recording stopped.', audioChunks);
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                console.log('Audio URL:', audioBlob);
                setAudioBlob(audioBlob);
                setAudioChunks([]);
            };
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
        setRecordingInProgress(false);
    };

    const playRecording = () => {
        if (audioBlob) {
            console.log('Playing audio...', audioBlob);
            const audio = new Audio();
            audio.src = URL.createObjectURL(audioBlob);
            audio.play();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
            <h1 className="text-6xl bg-clip-text glowing-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-bold pb-5 mb-6">
                <Typewriter text="start your journey" delay={100} />
            </h1>
            {/* <form
                onSubmit={handleSubmit}
                className="card w-1/3 bg-base-100 p-4 shadow-md"
            > */}
            <div>

                <button
                    id="record-button"
                    type="submit"
                    className={`btn w-32 h-32 text-base-content btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                    onMouseDown={startRecord}
                    onMouseUp={stopRecord}
                >
                    {loading ? (
                        <span className="loading loading-lg loading-infinity"></span>
                    ) : (
                        'Record'
                    )}
                </button>
                <button
                    id="record-button"
                    type="submit"
                    className={`btn w-20 h-20 text-base-content btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                    onClick={playRecording}
                >
                    {loading ? (
                        <span className="loading loading-lg loading-infinity"></span>
                    ) : (
                        'Play'
                    )}
                </button>
            </div>
            {/* </form> */}
            {recordingInProgress && (
                <div className="card">
                    <p className="text-base-content text-xl">Recording in Progress</p>
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
