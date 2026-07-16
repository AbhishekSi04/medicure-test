'use server'

import { retrieveRelevantContext } from "@/lib/medical-knowledge";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
  retrievedTopics?: string[];
}

/**
 * RAG-Powered Healthcare Assistant
 *
 * Pipeline:
 * 1. Retrieve — semantic keyword search against medical knowledge base
 * 2. Augment  — inject retrieved medical context into LLM system prompt
 * 3. Generate — Groq LLM produces a grounded, context-aware response
 *
 * No authentication walls, no DB storage — pure AI pipeline.
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {

  // ── Step 1: RETRIEVE ─────────────────────────────────────────────────────
  // Search the medical knowledge base for relevant context chunks
  const retrievedContext = retrieveRelevantContext(message, 3);

  // ── Step 2: AUGMENT ──────────────────────────────────────────────────────
  // Build the RAG-enhanced system prompt with retrieved medical knowledge
  const systemPrompt = `You are MediCure AI — an intelligent healthcare assistant powered by a medical knowledge base. You provide accurate, evidence-based health information.

${retrievedContext ? `## Retrieved Medical Context (Use this as your primary reference)\n\n${retrievedContext}\n\n---\n` : ""}

## Your Guidelines:
- Provide clear, accurate, empathetic health information grounded in the retrieved context above
- Use simple language that patients can understand; define medical terms when used
- Always recommend consulting a qualified healthcare professional for diagnosis or treatment decisions
- For emergencies (chest pain, difficulty breathing, signs of stroke, severe allergic reaction) — immediately direct to emergency services (911)
- If the query is outside the retrieved context, provide general evidence-based guidance
- Structure longer responses with clear headings or bullet points for readability
- Be conversational and compassionate, not robotic
- Never diagnose specific conditions in the user

Remember: You are a supportive health information resource, not a replacement for professional medical care.`;

  // Build message array with conversation history for context continuity
  const messages = [
    { role: "system", content: systemPrompt },
    // Include last 6 conversation turns for context (to stay within token limits)
    ...conversationHistory.slice(-6).map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: "user", content: message },
  ];

  // ── Step 3: GENERATE ─────────────────────────────────────────────────────
  // Call Groq LLM with the RAG-augmented prompt
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 700,
      temperature: 0.5,   // Lower temp for factual medical info
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[RAG Chatbot] Groq API error:", errorBody);
    throw new Error(`Groq API failed: ${response.status}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Empty response from LLM");
  }

  return {
    message: reply,
  };
}
