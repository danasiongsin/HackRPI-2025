export const speakWithElevenLabs = async (text) => {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.REACT_APP_ELEVEN_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.statusText}`);
    }

    // Response is audio/mpeg
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();
  } catch (err) {
    console.error("TTS error:", err);
  }
};
