'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AgentHome() {
  const [agent, setAgent] = useState(null);
  const [displayText, setDisplayText] = useState('My name is Nancy Tap anywhere to speak...');
  const [bgColor, setBgColor] = useState('black');

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  const bars = 40;
  const radius = 70;

  // ✅ Fetch agent data
  useEffect(() => {
    fetch('/api/agent/getagent')
      .then((res) => res.json())
      .then((data) => setAgent(data));
  }, []);

  // ✅ Load voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // ✅ Setup speech recognition
  useEffect(() => {
    if (typeof window === 'undefined' || !agent) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    if (!SpeechRecognition || !SpeechGrammarList) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    const grammar = '#JSGF V1.0; grammar commands; public <cmd> = red | green | blue | youtube | time | date ;';
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListeningRef.current = true;
    };

    recognition.onend = () => {
      isListeningRef.current = false;
    };

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript.toLowerCase();

      if (spokenText.includes(agent.name.toLowerCase())) {
        setDisplayText(`You said: ${spokenText}`);
        try {
          const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: spokenText,
              agentName: agent.name,
            }),
          });

          const data = await res.json();
          setDisplayText(data.response || 'No response from assistant.');

          const colors = ['red', 'green', 'blue', 'yellow', 'black', 'white'];
          const foundColor = colors.find((c) => spokenText.includes(c));
          if (foundColor) setBgColor(foundColor);

          const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.lang = 'hi-IN';
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find((v) => v.lang === 'hi-IN');
        if (hindiVoice) utterance.voice = hindiVoice;
        window.speechSynthesis.speak(utterance);
        } catch (error) {
        setDisplayText('उत्तर लाने में त्रुटि हुई।');
      }
      } else {
        setDisplayText(`❗ Say the agent's name "${agent.name}" in your command.`);
      }
    };

    recognition.onerror = (event) => {
      setDisplayText(`त्रुटि: ${e.error}`);
    };

    // ✅ Start recognition on tap
    document.body.onclick = () => {
      if (!isListeningRef.current) {
        setDisplayText('🎤 Listening...');
        recognition.start();
      } else {
        setDisplayText('⚠️ Already listening...');
      }
    };
  }, [agent]);

  return (
    <div
      className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      {agent && (
        <>
          <div className="rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src='/airobotimage.webp'
              alt="Agent"
              width={120} 
              height={120}
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="mt-6 text-xl text-white font-semibold">{agent.name}</h2>
          <h1 className="mt-4 text-lg text-white max-w-xl px-4 text-center">{displayText}</h1>
        </>
      )}
    </div>
  );
}
