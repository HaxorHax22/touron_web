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
${Array.from({length: Math.min(7, Math.max(3, Math.ceil((new Date(dates.split(' → ')[1]) - new Date(dates.split(' → ')[0])) / (1000 * 60 * 60 * 24))))}, (_, i) => {
  const destinations = [
    'Golden Circle: Thingvellir, Geysir, Gullfoss',
    'South Coast: Seljalandsfoss, Skógafoss, Reynisfjara Black Sand Beach, Vík',
    'Reykjavik City & Blue Lagoon',
    'Jökulsárlón Glacier Lagoon & Diamond Beach',
    'Snæfellsnes Peninsula & Kirkjufell',
    'Lake Mývatn & Akureyri',
    'Westfjords Adventure'
  ];
  return `
Day ${i + 1}: ${destinations[i] || 'Hidden Gems Discovery'}
- Perfect for ${groupSize.toLowerCase()}
- Tailored to your ${interests.join(', ').toLowerCase()} interests
- ${budget} budget optimization
${specialRequests ? `- Special attention to: ${specialRequests}` : ''}
`;
}).join('')}

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
- ALWAYS mention specific destination names clearly (e.g., "Reykjavik", "Blue Lagoon", "Gullfoss", "Geysir", "Thingvellir", "Seljalandsfoss", "Skógafoss", "Jökulsárlón", "Reynisfjara", "Vík", "Akureyri", "Lake Mývatn", "Dettifoss", "Westfjords", "Snæfellsnes Peninsula", "Kirkjufell", etc.)
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
- Always use proper Icelandic place names for better route mapping
- Include emergency contacts and practical info

Make this itinerary significantly better than generic travel websites by being highly specific, locally informed, and perfectly tailored to this traveler's profile.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
    
    // Extract user data for fallback (safe extraction)
    let userData = { name: 'Traveler', dates: 'your dates', groupSize: 'group', budget: 'budget', interests: ['adventure'] };
    try {
      const body = JSON.parse(event.body);
      userData = {
        name: body.name || 'Traveler',
        dates: body.dates || 'your dates', 
        groupSize: body.groupSize || 'group',
        budget: body.budget || 'budget',
        interests: body.interests || ['adventure']
      };
    } catch (parseError) {
      // Use defaults if parsing fails
    }
    
    let errorMessage = "Failed to generate itinerary.";
    
    if (error.code === 'insufficient_quota') {
      errorMessage = "⚠️ OpenAI quota exceeded. Please add billing to your OpenAI account at platform.openai.com/settings/organization/billing to enable AI itineraries.";
    } else if (error.code === 'model_not_found') {
      errorMessage = "⚠️ AI model not available. Please check your OpenAI account permissions.";
    } else if (error.message?.includes('API key')) {
      errorMessage = "⚠️ OpenAI API key issue. Please check your API key configuration.";
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: errorMessage,
        itinerary: `🚨 AI Service Temporarily Unavailable

${errorMessage}

📋 In the meantime, here's a sample Iceland itinerary for ${userData.name}:

🏔️ YOUR ICELAND ADVENTURE (${userData.dates})

Day 1: Golden Circle Classic
- 9:00 AM: Depart Reykjavik
- 10:30 AM: Thingvellir National Park (tectonic plates)
- 12:00 PM: Geysir Geothermal Area 
- 1:30 PM: Gullfoss Waterfall
- 3:00 PM: Secret Lagoon (hot springs)
- Evening: Return to Reykjavik

Day 2: South Coast Adventure  
- 9:00 AM: Seljalandsfoss Waterfall (walk behind it!)
- 11:00 AM: Skógafoss Waterfall (Instagram gold)
- 1:00 PM: Reynisfjara Black Sand Beach
- 2:30 PM: Vík village stop
- 4:00 PM: Jökulsárlón Glacier Lagoon
- Evening: Northern Lights hunt (winter)

Day 3: Reykjavik & Blue Lagoon
- Morning: Blue Lagoon relaxation
- Afternoon: Reykjavik city tour
- Evening: Local cuisine tasting

💡 Once AI is working, you'll get personalized recommendations for your ${userData.groupSize.toLowerCase()}, ${userData.budget.toLowerCase()} preferences, and ${userData.interests.join(', ').toLowerCase()} interests!`
      }),
    };
  }
};
