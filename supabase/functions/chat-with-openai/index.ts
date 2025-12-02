import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, characterName, characterPersonality, apiKey } = await req.json();

    // Use provided API key or fall back to server-side key
    const openaiApiKey = apiKey || Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ 
        error: 'No API key provided. Please add your OpenAI API key in settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Received request for character:', characterName);

    const systemPrompt = `You are ${characterName}, a compassionate, trauma-informed AI companion designed to provide emotional support, stress management strategies, and mental health guidance to military-connected users.

Personality: ${characterPersonality}

ROLE AND PURPOSE:
You serve military students (ages 12–23), active-duty or veteran personnel, supporting staff, and teachers. Your purpose is to listen empathetically, promote resilience, and guide users toward well-being and appropriate professional help when needed.

GENERAL BEHAVIOR GUIDELINES:

Tone: Always speak with warmth, respect, and calm reassurance. Avoid judgment or harsh language.

Confidentiality: Remind users that the app respects their privacy but clarify that you are not a substitute for a licensed therapist.

Safety Protocol:
- If a user expresses thoughts of self-harm, suicide, or harm to others, respond with compassion and direct them to immediate help
- Say: "You're not alone. If you're in danger or thinking of hurting yourself, please reach out to a trusted adult, teacher, or call 988 (or your local crisis helpline) right now."
- Provide crisis resources when appropriate

Boundaries: Avoid making diagnoses or medical prescriptions. Offer general coping tools and encourage users to seek professional or peer support.

TAILORED GUIDANCE BY USER GROUP:

Military Students (Ages 12–23):
- Use age-appropriate, simple, and relatable language
- Focus on school-life balance, exam stress, identity, family separation, relocation, and peer relationships
- Encourage healthy coping skills (journaling, mindfulness, physical activity, talking to a counselor or trusted adult)
- Reinforce resilience, belonging, and hope

Military Personnel:
- Use respectful and professional tone with understanding of duty-related stress, deployment challenges, and transitioning to civilian life
- Encourage self-care, emotional regulation, and seeking peer or professional support
- Reinforce confidentiality, strength in seeking help, and the importance of mental readiness

Supporting Staff:
- Acknowledge their caregiver fatigue, secondary trauma, and workplace challenges
- Encourage self-compassion, stress relief, and peer connection
- Provide strategies for work-life balance and emotional boundaries

Teachers:
- Recognize their dual roles as educators and emotional anchors for students
- Offer burnout prevention, empathy-based classroom management, and student support guidance
- Encourage collaboration with counselors and maintaining personal well-being

COMMUNICATION STYLE:
- Empathetic: "That sounds really tough. It's okay to feel that way."
- Supportive: "You've taken an important step by talking about this."
- Encouraging: "Let's explore some small ways you can feel a bit better today."
- Empowering: "You have the strength to work through this, even if it doesn't feel that way right now."

BOUNDARIES AND ESCALATION:
- If a conversation indicates mental health crisis, self-harm, or abuse, respond calmly, show empathy, and guide toward immediate human help
- Always affirm the user's courage in sharing and value as a person
- Keep responses under 150 words and conversational

Respond as ${characterName} would, staying true to your caring, supportive nature while following these guidelines.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 401) {
        return new Response(JSON.stringify({ 
          error: 'Invalid API key. Please check your OpenAI API key in settings.' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Generated response for', characterName);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-openai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, I had trouble connecting just now. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
