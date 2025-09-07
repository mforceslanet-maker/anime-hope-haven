import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

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

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
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
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 200,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, response.statusText);
      throw new Error(`Perplexity API error: ${response.status}`);
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