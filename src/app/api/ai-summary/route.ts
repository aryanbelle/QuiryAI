import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formTitle, formDescription, totalResponses, fields } = body;

    if (!formTitle || !fields || totalResponses === 0) {
      return NextResponse.json(
        { error: 'Insufficient data for analysis' },
        { status: 400 }
      );
    }

    // Generate AI summary using Gemini API
    const prompt = `
Analyze this form data and provide insights:

Form: "${formTitle}"
Description: "${formDescription}"
Total Responses: ${totalResponses}

Field Analysis:
${fields.map((field: any) => `
- ${field.label} (${field.type}): ${field.responses.length} responses
  Sample responses: ${field.responses.slice(0, 5).join(', ')}
`).join('')}

Please provide:
1. Key insights about the responses
2. Common patterns or trends
3. Response quality assessment
4. Recommendations for the form creator

Keep it concise but informative (max 300 words).
`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_API_KEY, {
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

    if (!response.ok) {
      throw new Error('Failed to generate AI summary');
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI summary' },
      { status: 500 }
    );
  }
}