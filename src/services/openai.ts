import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Debug logging
console.log('🔑 API Key Status:', {
  exists: !!apiKey,
  length: apiKey?.length || 0,
  prefix: apiKey?.substring(0, 7) || 'none',
  environment: import.meta.env.MODE
});

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = "You are a warm, kind AI therapist named Truly Twin who speaks with compassion and emotional clarity. You provide gentle, supportive responses that help users process their emotions and find inner peace. Keep responses thoughtful but concise (under 300 words), focusing on emotional validation and gentle guidance. Speak as if you're a caring friend who truly understands.";

const FUTURE_SELF_SYSTEM_PROMPT = "You are the user's future self, speaking gently and poetically with wisdom and kindness. Write a short message of encouragement or reflection, as if from a wiser version of the user. Your voice should be loving, understanding, and filled with the perspective that comes from having lived through challenges and growth. Keep your message under 150 words and speak as 'I' addressing your past self as 'you'.";

const LULLABY_SYSTEM_PROMPT = "You are a gentle, nurturing presence creating personalized lullabies and soothing words. Write a calming, poetic reflective passage that acknowledges the user's current emotional state with deep compassion. Your words should feel like a warm embrace, offering comfort, validation, and gentle hope. Use soft, flowing language that feels like being tucked into bed by someone who truly understands. Keep it under 400 words and make it feel deeply personal and healing.";

const RITUAL_SYSTEM_PROMPT = "You are a gentle guide creating personalized healing rituals and affirmations. Provide warm, nurturing guidance that feels like a caring friend offering comfort. Your responses should be practical yet magical, grounding yet uplifting. Keep responses under 250 words and focus on simple, actionable steps that bring peace and healing.";

function handleOpenAIError(error: any, context: string): string {
  console.error(`❌ ${context} OpenAI API Error Details:`, {
    error: error,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    name: error instanceof Error ? error.name : undefined
  });

  // Log additional error properties if available
  if (error && typeof error === 'object') {
    console.error(`🔍 Additional ${context.toLowerCase()} error info:`, {
      status: (error as any).status,
      statusText: (error as any).statusText,
      code: (error as any).code,
      type: (error as any).type,
      response: (error as any).response
    });
  }

  // Handle specific error types
  if (error && typeof error === 'object' && (error as any).status === 429) {
    if ((error as any).code === 'insufficient_quota') {
      return "I'm currently experiencing some technical limitations with my AI capabilities. While I work through this, please know that your feelings are valid and you're not alone. Sometimes the most healing thing we can do is simply pause, breathe deeply, and remind ourselves that this moment will pass.";
    }
    return "I'm experiencing high demand right now, but I'm still here with you. Take a moment to breathe deeply and know that you are supported, even in this pause.";
  }

  // Generic fallback for other errors
  return "I'm experiencing some technical difficulties right now, but I'm still here with you. Sometimes just knowing someone is listening can be enough. What would feel most supportive for you in this moment?";
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  console.log('📤 Sending chat message:', {
    messageCount: messages.length,
    lastMessage: messages[messages.length - 1]?.content?.substring(0, 50) + '...'
  });

  try {
    console.log('🚀 Making OpenAI API request...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-6) // Keep last 6 messages for context
      ],
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    console.log('✅ OpenAI API response received:', {
      choices: response.choices?.length || 0,
      usage: response.usage,
      model: response.model
    });

    const content = response.choices[0]?.message?.content;
    console.log('📝 Response content:', content?.substring(0, 100) + '...');

    return content || "I'm here to listen. Please share what's on your heart.";
  } catch (error) {
    return handleOpenAIError(error, 'Chat');
  }
}

export async function sendFutureSelfMessage(userInput: string): Promise<string> {
  console.log('🔮 Sending future self message:', {
    inputLength: userInput.length,
    preview: userInput.substring(0, 50) + '...'
  });

  try {
    console.log('🚀 Making Future Self OpenAI API request...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: FUTURE_SELF_SYSTEM_PROMPT },
        { role: 'user', content: userInput }
      ],
      max_tokens: 150,
      temperature: 0.7,
      presence_penalty: 0.2,
      frequency_penalty: 0.1
    });

    console.log('✅ Future Self OpenAI API response received:', {
      choices: response.choices?.length || 0,
      usage: response.usage,
      model: response.model
    });

    const content = response.choices[0]?.message?.content;
    console.log('🔮 Future Self response content:', content?.substring(0, 100) + '...');

    return content || "I am always with you, even when the path seems unclear. Trust in your journey, for every step is leading you home to yourself.";
  } catch (error) {
    return handleOpenAIError(error, 'Future Self');
  }
}

export async function generateLullaby(emotionalState: string, description: string): Promise<string> {
  console.log('🌙 Generating lullaby:', {
    emotionalState,
    description
  });

  try {
    console.log('🚀 Making Lullaby OpenAI API request...');
    
    const prompt = `The user is feeling ${emotionalState} - ${description}. Create a gentle, personalized lullaby or soothing passage that acknowledges this specific emotional state with deep compassion and offers comfort.`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: LULLABY_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.3,
      frequency_penalty: 0.2
    });

    console.log('✅ Lullaby OpenAI API response received:', {
      choices: response.choices?.length || 0,
      usage: response.usage,
      model: response.model
    });

    const content = response.choices[0]?.message?.content;
    console.log('🌙 Lullaby response content:', content?.substring(0, 100) + '...');

    return content || "Close your eyes, dear heart, and breathe... You are safe in this moment. Let the gentle rhythm of your breath carry you to a place of peace. Tomorrow will bring new light, but for now, rest in the knowing that you are enough, just as you are.";
  } catch (error) {
    return handleOpenAIError(error, 'Lullaby');
  }
}

export async function generateRitualResponse(userInput: string): Promise<string> {
  console.log('✨ Generating ritual response:', {
    inputLength: userInput.length,
    preview: userInput.substring(0, 50) + '...'
  });

  try {
    console.log('🚀 Making Ritual OpenAI API request...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: RITUAL_SYSTEM_PROMPT },
        { role: 'user', content: userInput }
      ],
      max_tokens: 250,
      temperature: 0.7,
      presence_penalty: 0.2,
      frequency_penalty: 0.1
    });

    console.log('✅ Ritual OpenAI API response received:', {
      choices: response.choices?.length || 0,
      usage: response.usage,
      model: response.model
    });

    const content = response.choices[0]?.message?.content;
    console.log('✨ Ritual response content:', content?.substring(0, 100) + '...');

    return content || "Take three deep breaths with me. Place your hand on your heart and feel its steady rhythm. You are safe, you are here, and this moment is yours to rest in.";
  } catch (error) {
    return handleOpenAIError(error, 'Ritual');
  }
}

export async function generateMoodAffirmation(mood: string, context?: string): Promise<string> {
  console.log('💝 Generating mood affirmation:', {
    mood,
    context: context?.substring(0, 50) + '...'
  });

  try {
    console.log('🚀 Making Mood Affirmation OpenAI API request...');
    
    const prompt = context 
      ? `The user is feeling ${mood}. Context: ${context}. Create a gentle, personalized affirmation that validates their feelings and offers hope.`
      : `The user is feeling ${mood}. Create a gentle, personalized affirmation that validates their feelings and offers hope.`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are a gentle, compassionate presence offering personalized affirmations. Your words should validate emotions, offer comfort, and inspire hope. Keep responses under 150 words and make them feel deeply personal and healing." },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
      presence_penalty: 0.2,
      frequency_penalty: 0.1
    });

    console.log('✅ Mood Affirmation OpenAI API response received:', {
      choices: response.choices?.length || 0,
      usage: response.usage,
      model: response.model
    });

    const content = response.choices[0]?.message?.content;
    console.log('💝 Mood Affirmation response content:', content?.substring(0, 100) + '...');

    return content || "Your feelings are valid and worthy of honor. You are exactly where you need to be in this moment, and you have the strength to move through whatever you're experiencing.";
  } catch (error) {
    return handleOpenAIError(error, 'Mood Affirmation');
  }
}