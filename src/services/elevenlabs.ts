const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Debug logging
console.log('🎵 ElevenLabs API Key Status:', {
  exists: !!apiKey,
  length: apiKey?.length || 0,
  prefix: apiKey?.substring(0, 7) || 'none',
  environment: import.meta.env.MODE
});

export async function generateSpeech(text: string, voiceId?: string): Promise<string | null> {
  const finalVoiceId = voiceId || import.meta.env.VITE_ELEVENLABS_VOICE_ID;
  
  if (!apiKey) {
    console.warn('🎵 ElevenLabs API key not found');
    return null;
  }

  if (!finalVoiceId) {
    console.warn('🎵 ElevenLabs Voice ID not found');
    return null;
  }

  console.log('🎵 Generating speech with ElevenLabs:', {
    textLength: text.length,
    voiceId: finalVoiceId,
    preview: text.substring(0, 50) + '...'
  });

  try {
    console.log('🚀 Making ElevenLabs API request...');
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${finalVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    console.log('📡 ElevenLabs API response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return null;
    }

    // Get the audio data as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    console.log('🎵 Audio buffer received:', {
      size: audioBuffer.byteLength,
      sizeKB: Math.round(audioBuffer.byteLength / 1024)
    });

    // Create a Blob from the ArrayBuffer
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    
    // Create an object URL for the Blob
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log('✅ Audio URL created:', audioUrl.substring(0, 50) + '...');

    return audioUrl;
  } catch (error) {
    console.error('❌ ElevenLabs API Error Details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });

    return null;
  }
}

// Cleanup function to revoke object URLs when no longer needed
export function cleanupAudioUrl(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
    console.log('🧹 Audio URL cleaned up');
  }
}