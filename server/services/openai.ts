import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export async function generateAIInsights(
  metricsData: any,
  apiKey: string
): Promise<Array<{ title: string; content: string; type: 'success' | 'warning' | 'info' }>> {
  const openai = new OpenAI({ apiKey });

  const prompt = `
    Analyze the following marketing performance data and provide actionable insights for a digital marketing manager. 
    Focus on identifying opportunities, potential issues, and strategic recommendations.
    
    Data:
    - Total Spend: $${metricsData.totalSpend || 0}
    - Total Conversions: ${metricsData.totalConversions || 0}
    - Total Impressions: ${metricsData.totalImpressions || 0}
    - Total Clicks: ${metricsData.totalClicks || 0}
    - Total Revenue: $${metricsData.totalRevenue || 0}
    - Average CTR: ${(metricsData.avgCtr || 0).toFixed(2)}%
    - Average ROAS: ${(metricsData.avgRoas || 0).toFixed(1)}x
    
    Provide exactly 3 insights in JSON format with this structure:
    {
      "insights": [
        {
          "title": "Brief descriptive title",
          "content": "Detailed insight with specific recommendations",
          "type": "success" | "warning" | "info"
        }
      ]
    }
    
    Guidelines:
    - Use "success" for positive performance highlights
    - Use "warning" for issues that need attention
    - Use "info" for strategic recommendations or neutral observations
    - Keep content practical and actionable for non-technical users
    - Include specific numbers when relevant
    - Focus on ROAS, CPA efficiency, and growth opportunities
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert digital marketing analyst. Provide clear, actionable insights based on campaign performance data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    return result.insights || [];
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw new Error("Failed to generate AI insights");
  }
}
