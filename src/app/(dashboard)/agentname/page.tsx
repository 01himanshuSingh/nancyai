'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAgentStore } from '@/app/store/agentstore';
import { useRouter } from 'next/navigation';
import React from 'react';

function EnterNamePage() {
  const router = useRouter();
  const { name, setName, image } = useAgentStore();

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('name', name);
    if (image instanceof File) {
      formData.append('file', image); // If uploaded file
    } else if (typeof image === 'string') {
      formData.append('imageurl', image); // If default image
    }

    const res = await fetch('/api/agent/createagent', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    router.push('/');
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-4">
      <Input
        placeholder="Enter your name"
        className="text-white"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      {name && (
        <div className="mt-4 text-lg font-semibold text-[#4e0131]">
          <Button
            onClick={handleCreate}
            className="bg-amber-100 cursor-pointer text-black"
          >
            Create Your Assistant
          </Button>
        </div>
      )}
    </div>
  );
}

export default EnterNamePage;
