const OpenAI = require('openai');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, dates, interests, pace, budget, groupSize, specialRequests } = body;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          itinerary: `🏔️ DEMO ITINERARY FOR ${name.toUpperCase()} 🏔️

Your personalized ${dates} Iceland adventure is ready! 

📍 DAYS BREAKDOWN:
${Array.from({length: Math.min(7, Math.max(3, Math.ceil((new Date(dates.split(' → ')[1]) - new Date(dates.split(' → ')[0])) / (1000 * 60 * 60 * 24))))}, (_, i) => `
Day ${i + 1}: Exploring Iceland's ${['South Coast', 'Golden Circle', 'Reykjavik', 'Westman Islands', 'Glacier Lagoon', 'Northern Lights', 'Blue Lagoon'][i] || 'Hidden Gems'}
- Perfect for ${groupSize.toLowerCase()}
- Tailored to your ${interests.join(', ').toLowerCase()} interests
- ${budget} budget optimization
${specialRequests ? `- Special attention to: ${specialRequests}` : ''}
`).join('')}

💡 INSIDER TIPS:
- Weather can change quickly - pack layers!
- Book Blue Lagoon tickets in advance
- Download offline maps for remote areas
- Keep ISK cash for small vendors
- Emergency number: 112

🎯 COST ESTIMATE: 
Your ${budget.toLowerCase()} ${groupSize.toLowerCase()} trip will cost approximately $${Math.round(
  (budget === 'Budget-Friendly' ? 80 : budget === 'Luxury' ? 250 : 150) * 
  Math.min(7, Math.max(3, Math.ceil((new Date(dates.split(' → ')[1]) - new Date(dates.split(' → ')[0])) / (1000 * 60 * 60 * 24)))) * 
  (groupSize.includes('Solo') ? 1 : groupSize.includes('Couple') ? 2 : groupSize.includes('Family') ? 3.5 : 4)
)} USD

⚠️ This is a DEMO itinerary. For fully personalized AI-generated itineraries, the site owner needs to configure the OpenAI API key.

🔧 Site owners: Add your OPENAI_API_KEY to Netlify environment variables to enable full AI functionality.

Happy travels! 🇮🇸` 
        }),
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Calculate trip duration
    const dateRange = dates.split(' → ');
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    const tripDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const prompt = `You're a friendly and highly experienced Icelandic travel expert who creates better itineraries than generic travel planning websites.

Create a personalized and geographically realistic ${tripDays}-day Iceland itinerary for ${name}, visiting from ${dates}. 

TRAVELER PROFILE:
- Group: ${groupSize}
- Interests: ${interests.join(', ')}
- Travel pace: ${pace.toLowerCase()}
- Budget style: ${budget.toLowerCase()}
- Special requests: ${specialRequests || 'None'}

ITINERARY REQUIREMENTS:
- Be hyper-personalized and practical
- Keep daily driving reasonable (under 3-4 hours/day)
- Include real landmarks, hikes, towns, and hidden gems in logical order
- Recommend specific restaurants, cafes, and accommodations
- Include cost-saving tips for budget travelers or luxury experiences for high-end
- Add seasonal considerations (Northern Lights, road conditions, etc.)
- Mention photography spots and Instagram-worthy locations
- Include practical details like opening hours, booking requirements
- Format clearly with day-by-day breakdown

SPECIAL FOCUS:
- Provide insider tips that tourists usually miss
- Include backup plans for weather
- Suggest local experiences over tourist traps
- Add specific GPS coordinates for hidden gems
- Include emergency contacts and practical info

Make this itinerary significantly better than generic travel websites by being highly specific, locally informed, and perfectly tailored to this traveler's profile.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
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
