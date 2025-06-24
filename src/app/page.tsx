'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AgentHome() {
  const [agent, setAgent] = useState<{ name: string; agentImageUrl: string } | null>(null);
  const bars = 40;
  const radius = 70;

  useEffect(() => {
    fetch('/api/agent/getagent')
      .then((res) => res.json())
      .then((data) => setAgent(data));
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-4">
      {agent && (
        <div className="relative flex flex-col items-center">
          {/* ✅ Top Voice Wave */}
          <div className="absolute top-[39px] rounded-full left-1/2 transform -translate-x-1/2 z-10 w-[120px] h-[30px] pointer-events-none">
            <div className="relative w-full h-full">
              {[...Array(bars)].map((_, i) => {
                const angle = Math.PI * (i / (bars - 1)); // spread bars over 180°
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                  <motion.div
                    key={i}
                    className="w-[2px] bg-[#00ffcc] absolute rounded"
                    style={{
                      left: `${x + radius}px`, // ✅ Corrected template literals
                      bottom: `${y}px`,
                      transform: 'translate(-50%, 0)',
                      height: '10px',
                    }}
                    animate={{ height: ['5px', '25px', '10px', '30px', '5px'] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'loop',
                      delay: i * 0.05,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* ✅ Agent Image */}
          <div className="rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={agent.agentImageUrl}
              alt="Agent Image"
              width={120}
              height={120}
              className="object-cover w-full h-full"
            />
          </div>

          <h2 className="mt-6 text-xl text-white font-semibold">{agent.name}</h2>
        </div>
      )}
    </div>
  );
}
