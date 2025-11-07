import OpenAI from 'openai';

// Initialize OpenAI client lazily to avoid build-time errors
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Export a getter function instead of the instance
export function getOpenAI() {
  return getOpenAIClient();
}

/**
 * Generate AI insights for campaigns
 */
export async function generateCampaignInsights(campaignData: any) {
  const prompt = `You are a performance marketing expert. Analyze the following campaign data and provide actionable optimization recommendations.

Campaign Data:
${JSON.stringify(campaignData, null, 2)}

Provide 1-2 optimization recommendations in JSON format:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "message": "Detailed explanation",
      "priority": "critical" | "opportunity" | "info",
      "suggestedActions": ["action1", "action2"]
    }
  ]
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a performance marketing expert. Analyze campaign data and provide actionable optimization recommendations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

/**
 * Extract campaign structure from natural language
 */
export async function extractCampaignFromText(userInput: string) {
  const prompt = `Extract structured campaign parameters from the following user description:

User Input: "${userInput}"

Respond with JSON in this exact format:
{
  "campaign_name": "string",
  "daily_budget": number (max 50),
  "campaign_type": "PERFORMANCE_MAX" | "SEARCH" | "DISPLAY",
  "goal": "CONVERSIONS" | "TRAFFIC" | "AWARENESS",
  "landing_page_url": "string (required)",
  "targeting": {
    "genders": ["MALE", "FEMALE", "ALL"],
    "age_ranges": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    "geo_locations": ["US-AK", "US-MN", ...],
    "interests": ["outdoor activities", ...]
  },
  "headlines": ["headline1", "headline2", "headline3"],
  "descriptions": ["desc1", "desc2"]
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a Google Ads campaign builder assistant. Extract structured campaign parameters from user descriptions. Always respond with valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const extracted = JSON.parse(content);

  // Enforce safety limits
  if (extracted.daily_budget > 50) {
    extracted.daily_budget = 50;
    extracted.budget_capped = true;
  }

  return extracted;
}

/**
 * Generate headlines and descriptions for campaigns
 */
export async function generateAdCopy(
  campaignName: string,
  description: string,
  landingPageUrl: string
) {
  const prompt = `Generate Google Ads creative copy for a campaign:

Campaign Name: ${campaignName}
Description: ${description}
Landing Page: ${landingPageUrl}

Generate:
- 3 headlines (max 30 characters each)
- 2 descriptions (max 90 characters each)

Respond in JSON format:
{
  "headlines": ["headline1", "headline2", "headline3"],
  "descriptions": ["desc1", "desc2"]
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a copywriting expert specializing in Google Ads. Generate compelling, concise ad copy that follows Google Ads character limits.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

