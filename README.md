# TourOn - AI-Powered Iceland Trip Planner

The smarter, faster, and free alternative to generic travel planning websites. Get personalized Iceland itineraries in under 60 seconds.

## 🚀 Features

- **Lightning Fast**: Complete itineraries in under 60 seconds
- **100% Free**: No premium plans or hidden fees
- **Iceland Expert**: Specialized local knowledge and hidden gems
- **Hyper-Personalized**: Budget, pace, interests, group size optimization
- **Cost Estimates**: Real budget calculations included
- **Weather Integration**: Seasonal tips and considerations
- **Interactive Features**: Map links, weather forecasts, sharing

## 🛠️ Setup Instructions

### Prerequisites

1. **Netlify Account**: For hosting the serverless functions
2. **OpenAI Account**: For AI-powered itinerary generation
3. **Node.js**: For package management (if developing locally)

### Deployment Setup

1. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Set build command: `npm install` (optional)
   - Set publish directory: `/` (root)

2. **Set Environment Variables** in Netlify:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Get OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create new API key
   - Add billing information (pay-per-use)
   - Copy key to Netlify environment variables

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Create `.env` file**:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run locally**:
   ```bash
   netlify dev
   ```

## 💰 Costs

- **Hosting**: Free on Netlify
- **OpenAI API**: ~$0.01-0.05 per itinerary (GPT-4 Turbo)
- **Domain**: Optional custom domain (~$10-15/year)

## 🔧 Technical Details

- **Frontend**: Vanilla HTML/CSS/JS with Tailwind CSS
- **Backend**: Netlify Functions (Node.js)
- **AI**: OpenAI GPT-4 Turbo
- **Styling**: Glass morphism design with animations
- **Mobile**: Fully responsive and touch-optimized

## 🚦 Current Status

- ✅ Frontend: Fully functional
- ✅ Backend: Code complete, needs API key setup
- ✅ UI/UX: Professional glass morphism design
- ✅ Mobile: Optimized for all devices
- ⚠️ Deployment: Requires OpenAI API key configuration

## 🆚 Competitive Advantages

- **Iceland Specialized** vs Generic global planners
- **Always Free** vs Premium subscription models
- **60-second results** vs 5-10 minute processes
- **Real cost estimates** vs No budget information
- **Weather integration** vs Generic recommendations
- **Local insider tips** vs Tourist trap suggestions

## 📝 License

MIT License - Feel free to use and modify for your projects. 