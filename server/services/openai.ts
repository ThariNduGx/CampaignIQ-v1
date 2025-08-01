import OpenAI from "openai";
import type { ReportData } from "./reports";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'success' | 'warning' | 'info' | 'error';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export async function generateAIInsights(reportData: ReportData): Promise<AIInsight[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `Analyze the following marketing campaign data and provide actionable insights:

Campaign Summary:
- Total Spend: $${reportData.summary.totalSpend}
- Total Clicks: ${reportData.summary.totalClicks}
- Total Impressions: ${reportData.summary.totalImpressions}
- Average CTR: ${reportData.summary.avgCtr}%
- Total Conversions: ${reportData.summary.totalConversions}
- Average ROAS: ${reportData.summary.avgRoas}

Google Analytics Data:
${JSON.stringify(reportData.platforms.google.analytics, null, 2)}

Meta Advertising Data:
${JSON.stringify(reportData.platforms.meta, null, 2)}

Please provide 3-5 specific, actionable insights in JSON format with the following structure:
{
  "insights": [
    {
      "title": "Insight Title",
      "content": "Detailed insight with specific recommendations",
      "type": "success|warning|info",
      "priority": "high|medium|low"
    }
  ]
}

Focus on:
1. Performance trends and anomalies
2. Platform comparison insights
3. Optimization recommendations
4. Budget allocation suggestions
5. Audience targeting improvements`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a digital marketing expert who analyzes campaign data and provides actionable insights. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    
    return result.insights.map((insight: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      title: insight.title,
      content: insight.content,
      type: insight.type || 'info',
      priority: insight.priority || 'medium',
      createdAt: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Return fallback insights if AI generation fails
    return [
      {
        id: 'fallback-1',
        title: 'AI Analysis Unavailable',
        content: 'Unable to generate AI insights at this time. Please ensure your OpenAI API key is configured correctly and try again.',
        type: 'warning' as const,
        priority: 'high' as const,
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export async function generateCampaignSummary(reportData: ReportData): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `Create a concise executive summary of this marketing campaign performance:

Total Spend: $${reportData.summary.totalSpend}
Total Clicks: ${reportData.summary.totalClicks}
Total Impressions: ${reportData.summary.totalImpressions}
CTR: ${reportData.summary.avgCtr}%
Conversions: ${reportData.summary.totalConversions}
ROAS: ${reportData.summary.avgRoas}

Platforms:
- Google: ${JSON.stringify(reportData.platforms.google, null, 2)}
- Meta: ${JSON.stringify(reportData.platforms.meta, null, 2)}

Provide a 2-3 paragraph executive summary highlighting key performance metrics, trends, and strategic recommendations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a digital marketing expert who creates executive summaries for campaign performance reports."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Unable to generate campaign summary at this time.";

  } catch (error) {
    console.error('Error generating campaign summary:', error);
    return "Campaign summary unavailable. Please check your OpenAI API configuration.";
  }
}