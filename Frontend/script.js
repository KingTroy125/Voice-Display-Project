let recognition;
        let transcriptHistory = '';
        let isListening = false;
        
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            
            recognition.onstart = () => {
                isListening = true;
                document.body.classList.add('listening');
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                document.getElementById('status').textContent = '🎤 Listening...';
                document.getElementById('output').textContent = 'Listening...';
            };

            recognition.onend = () => {
                if (isListening) {
                    // Restart recognition if we're still supposed to be listening
                    recognition.start();
                } else {
                    document.body.classList.remove('listening');
                    document.getElementById('startBtn').disabled = false;
                    document.getElementById('stopBtn').disabled = true;
                    document.getElementById('status').textContent = '⏹️ Stopped';
                    if (!transcriptHistory) {
                        document.getElementById('output').textContent = 'Waiting for speech...';
                        document.getElementById('output').classList.remove('has-content');
                    }
                }
            };
            
            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    transcriptHistory += finalTranscript;
                    const output = document.getElementById('output');
                    output.textContent = transcriptHistory;
                    output.classList.add('has-content');
                    // Scroll to bottom
                    output.scrollTop = output.scrollHeight;
                }
                
                // Show interim results
                if (interimTranscript) {
                    const output = document.getElementById('output');
                    output.textContent = transcriptHistory + interimTranscript;
                    output.classList.add('has-content');
                }
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                document.getElementById('status').textContent = '❌ Error: ' + event.error;
                
                if (event.error === 'no-speech') {
                    // Restart recognition if no speech was detected
                    if (isListening) {
                        recognition.stop();
                        setTimeout(() => recognition.start(), 100);
                    }
                }
            };
        } else {
            document.getElementById('output').textContent = 'Speech recognition is not supported in this browser.';
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = true;
        }

        function startListening() {
            if (recognition) {
                transcriptHistory = '';
                isListening = true;
                document.getElementById('output').classList.remove('has-content');
                recognition.start();
            }
        }

        function stopListening() {
            if (recognition) {
                isListening = false;
                recognition.stop();
            }
        }

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (recognition && isListening) {
                recognition.stop();
            }
        });