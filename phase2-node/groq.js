require("dotenv").config();
const axios = require("axios");

/**
 * Load Groq API keys (same account, rotated)
 */
const GROQ_KEYS = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY1
].filter(Boolean);

if (GROQ_KEYS.length === 0) {
  throw new Error("❌ No Groq API keys found in environment");
}

/**
 * GLOBAL rate limiting (ACCOUNT LEVEL)
 * Groq rate limits are account-based, not key-based
 */
let lastGroqCallTime = 0;
const GLOBAL_COOLDOWN_MS = 8000; // 🔥 CRITICAL (8 seconds)

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Enforce global cooldown before ANY Groq call
 */
async function waitForGlobalCooldown() {
  const now = Date.now();
  const elapsed = now - lastGroqCallTime;

  if (elapsed < GLOBAL_COOLDOWN_MS) {
    const waitTime = GLOBAL_COOLDOWN_MS - elapsed;
    console.log(`⏳ Global cooldown: waiting ${waitTime}ms`);
    await sleep(waitTime);
  }

  lastGroqCallTime = Date.now();
}

/**
 * Limit input size (token safety)
 */
function limitText(text, maxChars = 12000) {
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

/**
 * Low-level Groq API call
 */
async function callGroq(apiKey, title, safeContent) {
  return axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a professional technical content editor. Write detailed, structured, high-quality content."
        },
        {
          role: "user",
          content: `
Organize the content into the structure EXACTLY below.
Write as detailed and long as possible.

Title:
${title}

Introduction:
(2–3 detailed paragraphs)

Key Points:
- detailed point 1
- detailed point 2
- detailed point 3
- detailed point 4

Detailed Explanation:
(multiple paragraphs with clarity and examples)

Conclusion:
(detailed conclusion)

Rules:
- Remove duplicate information
- Do NOT mention URLs
- Do NOT mention sources
- Maintain clarity and logical flow

Raw Content:
${safeContent}
`
        }
      ],
      temperature: 0.3,
      max_tokens: 1200 // 🔥 reduced to avoid rate-limit pressure
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    }
  );
}

/**
 * MAIN FUNCTION
 * - global throttling
 * - key rotation
 * - safe retry
 */
async function organizeWithGroq(title, rawContent) {
  const safeContent = limitText(rawContent);

  // Shuffle keys (even though rate limit is account-wide)
  const keysToTry = [...GROQ_KEYS].sort(() => 0.5 - Math.random());

  let lastError;

  for (const key of keysToTry) {
    try {
      // 🔥 GLOBAL ACCOUNT COOLDOWN
      await waitForGlobalCooldown();

      console.log("🔑 Using Groq key:", key.slice(0, 8));

      const response = await callGroq(key, title, safeContent);

      return response.data.choices[0].message.content.trim();
    } catch (err) {
      lastError = err;
      const status = err.response?.status;

      console.log(
        "⚠️ Groq key failed:",
        key.slice(0, 8),
        status || err.message
      );

      // Extra cooldown on rate-limit
      if (status === 429) {
        console.log("⏳ Rate limited. Cooling down harder...");
        await sleep(15000); // long backoff
      }
    }
  }

  throw new Error(
    "❌ All Groq API keys failed (account-level rate limit reached)."
  );
}

module.exports = organizeWithGroq;
