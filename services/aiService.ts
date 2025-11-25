import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Refine Note using gemini-2.5-flash-lite
export const refineLeadNote = async (text: string): Promise<string> => {
  if (!text.trim()) return "";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `You are a professional sales assistant. Rewrite the following rough notes into a concise, professional Thai sales note. Do not add introductory text, just the refined note: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("AI Note Error:", error);
    return text;
  }
};

// Generate Speech using gemini-2.5-flash-preview-tts
export const playLeadSummary = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, 
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
       const audioBuffer = await decodeAudioData(
         decode(base64Audio), 
         audioContext,
         24000, 
         1
       );
       
       const source = audioContext.createBufferSource();
       source.buffer = audioBuffer;
       source.connect(audioContext.destination);
       source.start(0);
    }
  } catch (error) {
    console.error("TTS Error:", error);
    alert("ไม่สามารถเล่นเสียงได้ในขณะนี้");
  }
};

// Helper: Decode base64 to Uint8Array
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper: Decode PCM data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}