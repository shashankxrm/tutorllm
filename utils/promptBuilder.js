/**
 * Prompt builder for RAG query response generation
 * Creates dynamic prompts based on user query and selected mode
 */

/**
 * Combines retrieved chunks into a context string
 *
 * @param {Array<Object>} chunks - Retrieved chunks from vector store
 * @returns {string} Formatted context string
 */
function buildContext(chunks) {
  if (!chunks || chunks.length === 0) {
    return '';
  }

  return chunks
    .map((chunk, index) => {
      return `[Chunk ${index + 1}]\n${chunk.text}\n`;
    })
    .join('\n---\n\n');
}

/**
 * Builds prompt instructions based on query mode
 * Used to control the style and format of the LLM response
 *
 * @param {string} mode - Query mode: 'summary' | 'explain' | 'questions'
 * @returns {string} Mode-specific instruction
 */
function getModeInstruction(mode) {
  const instructions = {
    summary: `Please summarize the provided content clearly and concisely using bullet points. Focus on key takeaways and main concepts.`,

    explain: `Please explain the concepts in the provided content in simple, easy-to-understand terms. Include practical examples where relevant. Avoid technical jargon where possible.`,

    questions: `Based on the provided content, generate 5 interview questions that test understanding of the key concepts. Include a brief answer for each question.`,
  };

  return instructions[mode] || instructions.summary;
}

/**
 * Constructs the complete prompt for the LLM
 *
 * @param {Array<Object>} chunks - Retrieved chunks from similarity search
 * @param {string} query - Original user query
 * @param {string} mode - Response mode: 'summary' | 'explain' | 'questions'
 * @returns {string} Complete prompt ready for LLM
 */
function buildPrompt(chunks, query, mode = 'summary') {
  if (!chunks || chunks.length === 0) {
    return `User Query: ${query}\n\nNo relevant content found in the document database.`;
  }

  const context = buildContext(chunks);
  const instruction = getModeInstruction(mode);

  const prompt = `You are an AI Study Assistant. Your task is to help students understand study material.

${instruction}

---

USER QUERY:
${query}

---

CONTENT TO ANALYZE:
${context}

---

RESPONSE:`;

  return prompt;
}

module.exports = {
  buildPrompt,
  getModeInstruction,
  buildContext,
};
