import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CognitiveElement, SynthesisResult, DiagnosisResult } from "../types";
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
    4. Estimate "Rationality Stability" (0-100). Low = Irrational/Volatile, High = Calculative/Stable.
    5. Classify it as: 'Archetype' (a type of person), 'Phenomenon' (a market/social event), 'Paradox' (conflicting drives), or 'Compound'.

    Tone: Insightful, slightly cynical, academic yet accessible. Like a mix of Daniel Kahneman and a Sci-Fi profiler.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the synthesized behavioral archetype" },
      formula: { type: Type.STRING, description: "Formula representation" },
      description: { type: Type.STRING, description: "Insightful description of the behavior" },
      stability: { type: Type.INTEGER, description: "Rationality score 0-100" },
      type: { type: Type.STRING, enum: ['Archetype', 'Phenomenon', 'Paradox', 'Compound'] }
    },
    required: ["name", "formula", "description", "stability", "type"]
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
      stability: 0,
      type: 'Compound'
    };
  }
};

export const diagnoseScenario = async (scenario: string): Promise<DiagnosisResult> => {
  if (!apiKey) {
    return {
      summary: "Simulation Mode: API Key Missing.",
      elements: [
        { symbol: 'La', confidence: 85, reasoning: "Simulated detection of Loss Aversion." },
        { symbol: 'Sc', confidence: 60, reasoning: "Simulated detection of Sunk Cost." }
      ]
    };
  }

  // Create a reference list for the AI
  const referenceTable = ELEMENTS.map(e => `${e.symbol}: ${e.name} (${e.description})`).join('\n');

  const systemInstruction = `
    You are a Diagnostic Engine for the "Periodic Table of Cognitive Elements".
    Your task is to Reverse-Engineer a user-described scenario to identify the core Cognitive Biases at play.

    Reference Table:
    ${referenceTable}

    Rules:
    1. Analyze the user's text.
    2. Identify the top 2-4 elements from the Reference Table that best explain the behavior.
    3. Assign a confidence score (0-100) based on how strong the evidence is in the text.
    4. Provide a brief reasoning for each match.
    5. Provide a short clinical summary of the scenario.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "Clinical summary of the observed behavior" },
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
    required: ["summary", "elements"]
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
      summary: "Diagnostic System Error",
      elements: []
    };
  }
};