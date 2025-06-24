import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const agent = await prisma.agent.findFirst({
      orderBy: { createdAt: 'desc' }, // get latest agent
      select: {
        name: true,
        agentImageUrl: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ error: 'No agent found' }, { status: 404 });
    }

    return NextResponse.json(agent, { status: 200 });
  } catch (error) {
    console.error('Fetch agent error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
