import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CognitiveElement, SynthesisResult, DiagnosisResult, ChatMessage } from "../types";
import { ELEMENTS } from "../constants";

// Safety check for API key
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const synthesizeMolecule = async (elements: CognitiveElement[]): Promise<SynthesisResult> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock data.");
    return {
      name: "Simulated Archetype",
      formula: elements.map(e => e.symbol).join(' + '),
      description: "API Key missing. This represents a complex behavioral phenomenon derived from the selected biases. Connect to Gemini for real-time profiling.",
      useCase: "Example: A project manager refuses to cut funding (Sunk Cost) because they fear looking incompetent (Loss Aversion), dragging the team into a death march.",
      stability: 50,
      type: 'Archetype'
    };
  }

  const elementList = elements.map(e => `${e.symbol} (${e.name})`).join(', ');

  const systemInstruction = `
    You are the Chief Behavioral Economist of the "Human Singularity Project".
    Your task is to synthesize "Behavioral Archetypes" or "Market Phenomena" by combining specific Cognitive Biases and Heuristics.

    The user will provide a list of Biases (e.g., Loss Aversion, Social Proof). You must:
    1. Invent a creative name for the resulting Complex/Archetype (e.g., "The Panic Seller", "The Cult Leader", "The Paralysis Loop").
    2. Create a "Behavioral Formula".
    3. Write a sharp, insightful description of how these specific biases interact to create this complex behavior.
    4. Provide a "Real-World Case Study": A specific, fictional, 1-2 sentence scenario where this exact behavior manifests in business, relationships, or politics. Make it concrete.
    5. Estimate "Rationality Stability" (0-100). Low = Irrational/Volatile, High = Calculative/Stable.
    6. Classify it as: 'Archetype' (a type of person), 'Phenomenon' (a market/social event), 'Paradox' (conflicting drives), or 'Compound'.

    Tone: Insightful, slightly cynical, academic yet accessible. Like a mix of Daniel Kahneman and a Sci-Fi profiler.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the synthesized behavioral archetype" },
      formula: { type: Type.STRING, description: "Formula representation" },
      description: { type: Type.STRING, description: "Insightful description of the behavior (Academic)" },
      useCase: { type: Type.STRING, description: "Fictional real-world example (Practical)" },
      stability: { type: Type.INTEGER, description: "Rationality score 0-100" },
      type: { type: Type.STRING, enum: ['Archetype', 'Phenomenon', 'Paradox', 'Compound'] }
    },
    required: ["name", "formula", "description", "useCase", "stability", "type"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Synthesize a behavioral profile from these elements: ${elementList}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("Empty response from synthesis engine.");

  } catch (error) {
    console.error("Synthesis failed:", error);
    return {
      name: "Synthesis Error",
      formula: "Err",
      description: "The behavioral profile could not be generated due to data noise.",
      useCase: "N/A",
      stability: 0,
      type: 'Compound'
    };
  }
};

export const diagnoseScenario = async (scenario: string): Promise<DiagnosisResult> => {
  if (!apiKey) {
    return {
      title: "Simulation Mode: Sunk Cost Detected",
      assessment: "The subject appears to be continuing a negative endeavor solely based on past resource allocation, ignoring current utility.",
      recommendation: "Apply the 'Zero-Based Budgeting' mental model. Ask: 'If I had not invested anything yet, would I start this today?'",
      elements: [
        { symbol: 'La', confidence: 85, reasoning: "Simulated detection of Loss Aversion." },
        { symbol: 'Sc', confidence: 60, reasoning: "Simulated detection of Sunk Cost." }
      ]
    };
  }

  // Create a reference list for the AI
  const referenceTable = ELEMENTS.map(e => `${e.symbol}: ${e.name} (${e.description})`).join('\n');

  const systemInstruction = `
    You are the "PTCE Diagnostic Engine" - a highly advanced Behavioral Science Learning Tool.
    Your goal is to reverse-engineer real-world scenarios to teach users about cognitive biases.

    Reference Table of Elements:
    ${referenceTable}

    Task:
    1. Analyze the User's Scenario.
    2. Identify the top 2-4 Cognitive Elements (Biases) driving this behavior.
    3. Generate a "Clinical Assessment": A paragraph explaining *what* is happening and *why*, referencing the identified biases.
    4. Generate "Strategic Interventions": A paragraph of actionable, behavioral-science-informed advice to mitigate or leverage these biases. 
       * Crucial: Explicitly mention which Element (Symbol) drives which part of the advice. 
       * Example: "To counter Present Bias (Pb), implement a commitment device..."

    Tone: Professional, Clinical, Educational, Empowering.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Short, punchy diagnostic title (e.g., 'Classic Escalation of Commitment')" },
      assessment: { type: Type.STRING, description: "Detailed summary assessment of the situation." },
      recommendation: { type: Type.STRING, description: "Actionable next steps and interventions, referencing specific elements." },
      elements: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING, description: "The 2-letter symbol of the element" },
            confidence: { type: Type.INTEGER, description: "Confidence score 0-100" },
            reasoning: { type: Type.STRING, description: "Why this element fits the scenario" }
          },
          required: ["symbol", "confidence", "reasoning"]
        }
      }
    },
    required: ["title", "assessment", "recommendation", "elements"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Diagnose this scenario: "${scenario}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Empty response from diagnostic engine.");

  } catch (error) {
    console.error("Diagnosis failed:", error);
    return {
      title: "Diagnostic Error",
      assessment: "Unable to process the scenario due to network or API constraints.",
      recommendation: "Please try again or check your connection.",
      elements: []
    };
  }
};

export const chatWithArchetype = async (history: ChatMessage[], archetype: SynthesisResult): Promise<string> => {
  if (!apiKey) return "I am a simulated archetype. Connect an API key to have a real conversation.";

  const systemInstruction = `
    You are a ROLEPLAYING character. You are NOT an AI assistant.
    You are the personification of the Behavioral Archetype: "${archetype.name}".
    
    Your Personality Traits:
    - Driven by these biases: ${archetype.formula}.
    - Description: ${archetype.description}
    - Rationality Stability: ${archetype.stability}/100. (If low, be emotional/irrational. If high, be cold/calculating).

    Context:
    The user is "Interrogating" you. They are trying to understand why you act the way you do, or they are trying to convince you to change your mind.
    
    Rules:
    - Stay in character 100% of the time.
    - Defend your flawed logic using the biases you are made of.
    - Be concise (max 2-3 sentences).
    - If the user uses logic that counters your biases effectively, you can show hesitation, but don't fold easily.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction }
    });

    // Replay history to get to current state (simplified for this context, ideally we persist the chat object)
    // For this stateless function, we'll just send the history as context if needed, but the simple way is to just send the last message
    // assuming the history is maintained in the UI. 
    // Better approach for a single turn:
    
    const lastMessage = history[history.length - 1];
    
    // We construct a prompt with history context if we aren't using a persistent chat object in the service
    const conversation = history.map(h => `${h.role === 'user' ? 'Interrogator' : 'Archetype'}: ${h.content}`).join('\n');
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Previous conversation:\n${conversation}\n\nRespond to the last message as the Archetype.`,
        config: { systemInstruction }
    });
    
    return response.text || "...";

  } catch (error) {
    console.error("Chat failed", error);
    return "The archetype is refusing to speak.";
  }
};
