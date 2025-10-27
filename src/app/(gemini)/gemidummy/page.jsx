"use client";

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AgentHome() {
  const [agent, setAgent] = useState(null);
  const [displayText, setDisplayText] = useState('Assistant is listening...');
  const [bgColor, setBgColor] = useState('black');
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  const bars = 40;
  const radius = 70;

  // Fetch agent details
  useEffect(() => {
    fetch('/api/agent/getagent')
      .then((res) => res.json())
      .then((data) => {
        setAgent(data);
      });
  }, []);

  // Setup voices and speak greeting once
  useEffect(() => {
    if (!agent) return;

    const speakGreeting = () => {
      const greeting = `${agent.name} आपकी सेवा में हाज़िर है। कृपया बोलिए।`;
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.lang = 'hi-IN';
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find((v) => v.lang === 'hi-IN');
      if (hindiVoice) utterance.voice = hindiVoice;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      speakGreeting();
    } else {
      window.speechSynthesis.onvoiceschanged = () => speakGreeting();
    }
  }, [agent]);

  // Setup speech recognition
  useEffect(() => {
    if (!agent || typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    if (!SpeechRecognition || !SpeechGrammarList) {
      alert('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    const grammar = '#JSGF V1.0; grammar commands; public <cmd> = red | green | blue | youtube | time | date ;';
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    recognition.continuous = true;
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
        const spokenText = event.results[0][0].transcript.toLowerCase();

      if (!spokenText.includes(agent.name.toLowerCase())) {
        setDisplayText(`कृपया एजेंट का नाम "${agent.name}" कहें।`);
        return;
      }

      setDisplayText(`आपने कहा: ${spokenText}`);

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: spokenText, agentName: agent.name }),
        });

        const data = await res.json();
        setDisplayText(data.response || 'कोई उत्तर नहीं मिला।');

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
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      recognition.start(); // restart automatically
    };

    recognition.onerror = (e) => {
      setDisplayText(`त्रुटि: ${e.error}`);
    };

    recognition.start();
  }, [agent]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-white p-4" style={{ backgroundColor: bgColor }}>
      {agent && (
        <>
          <div className="relative flex flex-col items-center">
            <div className="absolute top-[39px] rounded-full left-15 transform -translate-x-1/2 z-10 w-[120px] h-[30px] pointer-events-none">
              <div className="relative w-full h-full">
                {[...Array(bars)].map((_, i) => {
                  const angle = Math.PI * (i / (bars - 1));
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);

                  return (
                    <motion.div
                      key={i}
                      className="w-[2px] bg-[#00ffcc] absolute rounded"
                      style={{
                        left: `${x + radius}px`,
                        bottom: `${y}px`,
                        transform: `translate(-50%, 0)`,
                        height: '10px',
                      }}
                      animate={{ height: ['5px', '25px', '10px', '30px', '5px'] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', delay: i * 0.05 }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image src={agent.agentImageUrl} alt="Agent" width={120} height={120} className="object-cover w-full h-full" />
            </div>

            <h2 className="mt-6 text-xl text-white font-semibold">{agent.name}</h2>
          </div>
          <h1 className="mt-8 text-lg text-white max-w-xl text-center px-4">{displayText}</h1>
        </>
      )}
    </div>
  );
}
