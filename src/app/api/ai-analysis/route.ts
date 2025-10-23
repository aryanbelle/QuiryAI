import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: any;
  
  try {
    body = await request.json();
    const { formTitle, totalResponses, responseData, customQuestion } = body;

    if (!formTitle || !responseData || totalResponses === 0) {
      return NextResponse.json(
        { error: 'Insufficient response data for analysis' },
        { status: 400 }
      );
    }

    // Create focused prompt for response analysis
    const prompt = customQuestion 
      ? createCustomAnalysisPrompt(formTitle, responseData, customQuestion)
      : createGeneralAnalysisPrompt(formTitle, responseData);

    console.log('Making Gemini API request for response analysis...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate analysis';
    
    if (!analysis || analysis === 'Unable to generate analysis') {
      console.error('No valid analysis generated from Gemini API');
      throw new Error('No valid analysis generated');
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error generating AI analysis:', error);
    
    // Provide a fallback analysis based on the response data
    const fallbackAnalysis = generateFallbackAnalysis(body?.formTitle, body?.responseData, body?.customQuestion);
    
    return NextResponse.json({ 
      analysis: fallbackAnalysis,
      note: 'Generated using fallback analysis due to AI service unavailability'
    });
  }
}

function createGeneralAnalysisPrompt(formTitle: string, responseData: any[]): string {
  const sampleResponses = responseData.slice(0, 10); // Limit for API efficiency
  
  return `
Analyze these actual form responses and provide insights:

Form: "${formTitle}"
Total Responses: ${responseData.length}

Sample Response Data:
${sampleResponses.map((response, index) => `
Response ${index + 1}:
${Object.entries(response).filter(([key]) => key !== 'submittedAt').map(([field, value]) => `• ${field}: ${value}`).join('\n')}
`).join('\n')}

Please provide:
1. Key patterns and trends in the actual responses
2. Most common answers and themes
3. Notable insights from the data
4. Actionable recommendations based on what users are saying

Focus on the actual response content, not form structure. Keep it concise (max 250 words).
`;
}

function createCustomAnalysisPrompt(formTitle: string, responseData: any[], question: string): string {
  const sampleResponses = responseData.slice(0, 15); // More data for custom questions
  
  return `
Analyze these form responses to answer this specific question: "${question}"

Form: "${formTitle}"
Total Responses: ${responseData.length}

Response Data:
${sampleResponses.map((response, index) => `
Response ${index + 1}:
${Object.entries(response).filter(([key]) => key !== 'submittedAt').map(([field, value]) => `• ${field}: ${value}`).join('\n')}
`).join('\n')}

Question: ${question}

Please provide a focused analysis that directly answers this question based on the actual response data. Be specific and cite examples from the responses when relevant. Keep it concise but thorough (max 300 words).
`;
}

function generateFallbackAnalysis(formTitle: string, responseData: any[], customQuestion?: string): string {
  if (!responseData || responseData.length === 0) {
    return "📊 No response data available for analysis.";
  }

  let analysis = `📊 Response Analysis: "${formTitle}"\n\n`;
  
  if (customQuestion) {
    analysis += `🔍 Question: ${customQuestion}\n\n`;
    analysis += `📈 Based on ${responseData.length} responses:\n`;
    analysis += `• Analysis requires AI service for detailed insights\n`;
    analysis += `• Consider reviewing individual responses for patterns\n`;
    analysis += `• Look for common themes in open-ended responses\n\n`;
  } else {
    analysis += `📈 Response Overview:\n`;
    analysis += `• Total responses analyzed: ${responseData.length}\n`;
    
    // Analyze response completeness
    const avgFieldsCompleted = responseData.reduce((acc, response) => {
      const completedFields = Object.values(response).filter(value => 
        value !== null && value !== undefined && value !== ''
      ).length;
      return acc + completedFields;
    }, 0) / responseData.length;
    
    analysis += `• Average fields completed: ${Math.round(avgFieldsCompleted * 10) / 10}\n`;
    analysis += `• Response completion rate: ${Math.round((avgFieldsCompleted / Object.keys(responseData[0] || {}).length) * 100)}%\n\n`;
    
    // Find most common field values
    const fieldAnalysis: Record<string, Record<string, number>> = {};
    responseData.forEach(response => {
      Object.entries(response).forEach(([field, value]) => {
        if (field !== 'submittedAt' && value) {
          if (!fieldAnalysis[field]) fieldAnalysis[field] = {};
          const stringValue = String(value).toLowerCase();
          fieldAnalysis[field][stringValue] = (fieldAnalysis[field][stringValue] || 0) + 1;
        }
      });
    });
    
    analysis += `🔍 Key Insights:\n`;
    Object.entries(fieldAnalysis).slice(0, 3).forEach(([field, values]) => {
      const topValue = Object.entries(values).sort(([,a], [,b]) => b - a)[0];
      if (topValue) {
        analysis += `• ${field}: Most common response is "${topValue[0]}" (${topValue[1]} times)\n`;
      }
    });
    
    analysis += `\n💡 Recommendations:\n`;
    analysis += `• Review individual responses for detailed insights\n`;
    analysis += `• Look for patterns in open-ended feedback\n`;
    analysis += `• Consider follow-up questions based on common themes\n`;
  }
  
  return analysis;
}