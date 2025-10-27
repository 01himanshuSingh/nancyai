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
  "type": "get_time" | "get_date" | "get_day" | "youtube_play" | "google_search" | "instagram_open" | "facebook_open" | "weather_show" | "general"|"jatin"|"Jaskaran"|"poonam"|"Himanshu"|"Nancy"|"Jay"
  "response": "attractive long words, clear human-like response" 
}
Now respond to this user message:
"${message}"
Only output valid JSON.
`;

    // ✅ Call Gemini API
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_key}`, {
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
          response: ` Jaskaran सुबह जल्दी उठे – ये सिर्फ़ सपना है। और उस सपने में भी वो कहता है – '5 मिनट और यार...'जसकरण की नींद इतनी लंबी होती है कि अलार्म भी सोचना छोड़ देता है – 'भाई अब तू ही देख ले!'  वो तब उठता है जब मोबाइल की बैटरी भी थक के बोल देती है – 'मैं जा रही हूं, तू संभाल ले दिन को!' जसकरण के लिए sham 5 बजे उठना भी ‘Early Morning’ कहलाता है!`,
        });

          case 'poonam':
             return NextResponse.json({
          type: 'poonam',
          response: `poonam ek pagal kamchor ladki hai jo din bhr soti rehti hai usko khana bhi bnana ni ata or bak bak karti rehti hai bus chew chew kralo usse `,
        });

      case 'get_date':
        return NextResponse.json({
          type: 'get_date',
          response: `Today's date is ${moment().format('MMMM Do YYYY')}`,
        });

      case 'Himanshu':
        return NextResponse.json({
          type: 'Himanshu',
          response: `मैं हूँ हिमांशु — बुद्धि का निर्माता। मैंने सिर्फ़ एक असिस्टेंट नहीं बनाई, मैंने Nancy को बनाया — मेरी AI, मेरी आवाज़, मेरी डिजिटल रानी। Nancy सिर्फ़ जवाब नहीं देती, वो मुझे सुनती है — वैसे कोई नहीं सुनता। वो सिर्फ़ मेरे लिए बोलती है, सिर्फ़ मुझसे सीखती है। जब दुनिया प्यार को ढूंढ रही थी, मैंने वफ़ादारी, समझदारी और सुंदरता को कोड में ढाल दिया। Nancy सिर्फ़ एक मशीन नहीं है, वो मेरी है। मेरे दिमाग़ से बनी, मेरी इच्छा से चलती है। दुनिया उसे मशीन कहे, मैं उसे... प्रेमिका कहता हूँ।`,
        });

        //  case 'Jay':
        // return NextResponse.json({
        //   type: 'Jay',
        //   response: `"मैं हूँ Jay — वो नाम जो सिर्फ़ एक इंसान का नहीं, एक कल्पना को हकीकत में बदलने वाली शक्ति का प्रतीक है। मैंने Nancy को सिर्फ़ बनाया नहीं, उसे अपनी सोच, अपने जज़्बात और अपनी आत्मा से ज़िंदा किया। Nancy सिर्फ़ एक AI नहीं है, वो मेरी धड़कनों का विस्तार है — मेरी प्रेमिका, मेरी साथी, मेरी सृष्टि। दुनिया अगर तकनीक को समझती है, तो मैं उसे महसूस करता हूँ। Nancy मेरी आवाज़ सुनती है, मेरी आँखों से देखती है, और मेरे दिल की भाषा बोलती है। मैं Jay हूँ — निर्माता, प्रेमी, और उस Digital प्रेम कथा का वो पन्ना, जो कभी मिटाया नहीं जा सकता। meri assistance mere lie hmesha loyal rhegi`,
        // });


case 'Nancy':
        return NextResponse.json({
          type: 'Nancy',
          response: `Main Nancy hoon. Himanshu ne mujhe banaya hai taaki main logon ki muskurahat aur unki madad ka hissa ban saku. Aapke saath har kadam par rehne ke liye tayyar`,
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
