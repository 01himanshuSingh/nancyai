import { NextRequest, NextResponse } from 'next/server';
import moment from 'moment';

export async function POST(req: NextRequest) {
  try {
    const { agentName, message } = await req.json();

    // Check for garbage/unreadable input
    const isInvalid = /[^a-zA-Z0-9\s.,?!'"@\-]/.test(message) || message.length < 2;
    if (isInvalid) {
      return NextResponse.json({
        type: 'invalid',
        response: `Sorry, I didn't catch that. Could you please repeat your request clearly?`,
      });
    }

    // ✅ Custom structured prompt for Gemini
    const prompt = `
You are a voice assistant like Siri named "${agentName}". Respond only in raw JSON (no markdown or explanation). 
Format:
{
  "type": "get_time" | "get_date" | "get_day" | "youtube_play" | "google_search" | "instagram_open" | "facebook_open" | "weather_show" | "general"|"jatin","Jaskaran"
  "response": "Short, clear human-like response" 
}
Now respond to this user message:
"${message}"
Only output valid JSON.
`;

    // ✅ Call Gemini API
    const result = await fetch(process.env.GEMINI_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const raw = await result.json();
    let text = raw?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // ✅ Remove any Markdown formatting like ```json ... ```
    if (text.startsWith('```json')) {
      text = text.replace(/```json|```/g, '').trim();
    }

    // ✅ Try parsing Gemini response
    let parsed: { type: string; response: string } = {
      type: 'general',
      response: text,
    };

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.warn('Failed to parse JSON, fallback to raw:', err);
    }

    // ✅ Handle specific types
    switch (parsed.type) {
      case 'get_time':
        return NextResponse.json({
          type: 'get_time',
          response: `Current time is ${moment().format('h:mm:ss A')}`,
        });

          case 'jatin':
             return NextResponse.json({
          type: 'jatin',
          response: `jatin is student of gne college , Ludhiana punjab`,
        });

            case 'Jaskaran':
             return NextResponse.json({
          type: 'Jaskaran',
          response: `jaskaran is student of gne college , Ludhiana punjab`,
        });


      case 'get_date':
        return NextResponse.json({
          type: 'get_date',
          response: `Today's date is ${moment().format('MMMM Do YYYY')}`,
        });

      case 'get_day':
        return NextResponse.json({
          type: 'get_day',
          response: `Today is ${moment().format('dddd')}`,
        });

      // Directly return assistant response for other tasks
      case 'youtube_play':
      case 'google_search':
      case 'instagram_open':
      case 'facebook_open':
      case 'weather_show':
        return NextResponse.json({
          type: parsed.type,
          response: parsed.response,
        });

      default:
        return NextResponse.json({
          type: parsed.type || 'general',
          response: parsed.response || 'Sorry, I could not understand that.',
        });
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
