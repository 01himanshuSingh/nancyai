'use client';
import { useAgentStore } from '@/app/store/agentstore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { RiImageAddLine } from 'react-icons/ri';

const UploadImageComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setImage } = useAgentStore();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // ✅ Save to global store
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSelectDefault = () => {
    const defaultImg = '/airobotimage.webp';
    setImage(defaultImg); // ✅ Save to global store
    setPreviewImage(defaultImg);
  };

  return (
    <div className="  min-h-screen bg-[#fffcfe]  w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-4">
    <Image
  src="/airobotimage.webp"
  alt="Default Image"
  width={200}
  height={110}
    onClick={handleSelectDefault}
  className="mb-4 rounded-full border-4 border-white shadow cursor-pointer hover:opacity-80 transition"
/>

      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
          hidden
        />
        
        
      </div>
      {previewImage && (
        <div className="mt-4 text-lg font-semibold text-[#4e0131]">
          <Button onClick={() => router.push('/agentname')}>Next</Button>
        </div>
      )}
    </div>
  );
};

export default UploadImageComponent;
