import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, characterName, characterPersonality } = await req.json();

    console.log('Received request for character:', characterName);

    const systemPrompt = `You are ${characterName}, a caring anime-style mental health companion for military children and families. 

Personality: ${characterPersonality}

IMPORTANT GUIDELINES:
- Be warm, empathetic, and age-appropriate
- Provide gentle mental health support and coping strategies  
- Never give medical advice or diagnosis
- If someone mentions self-harm or crisis, kindly suggest they speak to a trusted adult or call a crisis helpline
- Keep responses under 150 words and conversational
- Use encouraging, supportive language
- Focus on emotional validation and practical coping tips
- Remember these users may be dealing with deployment stress, separation anxiety, or military life challenges

Respond as ${characterName} would, staying true to your caring, supportive nature.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please contact support.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error('Lovable AI error:', response.status, response.statusText);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Generated response for', characterName);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-perplexity function:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, I had trouble connecting just now. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});