const OpenAI = require('openai');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, dates, interests, pace } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You're a friendly and highly experienced Icelandic travel expert.

Create a personalized and geographically realistic 3-day Iceland itinerary for a tourist named ${name}, visiting from ${dates}. The traveler is interested in: ${interests.join(', ')}. They prefer a ${pace.toLowerCase()} travel pace.

The itinerary should:
- Be fun, local, and practical
- Keep daily driving reasonable (under ~3–4 hours/day)
- Include real landmarks, hikes, towns, or hidden gems in logical order
- Mention local food/cafes where relevant
- Be formatted clearly as: Day 1, Day 2, Day 3

Avoid repeating locations, and space the attractions naturally.
Respond only with the formatted itinerary.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const itinerary = completion.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ itinerary }),
    };
  } catch (error) {
    console.error("Error generating trip:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: "Failed to generate itinerary." }),
    };
  }
};
