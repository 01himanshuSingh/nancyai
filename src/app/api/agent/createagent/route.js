// app/api/agent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import uploadCloudinary from '../../../../lib/config/cloudnary'
import formidable from "formidable"
import { writeFile } from "fs/promises";
import path from "path";


export const config = {
  api: { bodyParser: false }, // disable default body parser
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name')
    const imageFile = formData.get('file')
    const imageUrlInput = formData.get('imageurl')

    let imageUrl = imageUrlInput;

    // 🖼️ If file uploaded, handle temp file and Cloudinary upload
    if (imageFile && typeof imageFile === 'object') {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = join('/tmp', imageFile.name);

      await writeFile(tempPath, buffer);
      imageUrl = await uploadCloudinary(tempPath);
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        agentImageUrl: imageUrl || '',
        userId: '001001', // ✅ Update based on actual user logic
        instruction: 'Default instruction...',
      },
    });

    return NextResponse.json({ agent });
  } catch (error) {
    console.error("Agent creation error:", error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
