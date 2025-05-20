const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const PROMPT = `
You map messages to {intent, params}. Intents:
  - query_flights
  - buy_ticket
  - check_in
Return only JSON.
User: "{{text}}"
`;

exports.parse = async (text) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: PROMPT.replace("{{text}}", text) }]
  });
  return JSON.parse(completion.choices[0].message.content);
};
