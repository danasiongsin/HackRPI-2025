export const speakWithElevenLabs = async (text, onStart, onEnd) => {
  try {
    onStart?.();  // tell UI that sound started

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.REACT_APP_ELEVEN_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.7
          }
        })
      }
    );

    const audioBlob = await response.blob();
    const url = URL.createObjectURL(audioBlob);

    const audio = new Audio(url);

    audio.onended = () => {
      onEnd?.();   // tell UI that sound stopped
    };

    audio.play();
  } catch (error) {
    console.error("TTS error:", error);
    onEnd?.();
  }
};
