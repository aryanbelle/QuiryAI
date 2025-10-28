import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: any;

  try {
    body = await request.json();
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

    console.log('Making Gemini API request...');
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
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';

    if (!summary || summary === 'Unable to generate summary') {
      console.error('No valid summary generated from Gemini API');
      throw new Error('No valid summary generated');
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error generating AI summary:', error);

    // Provide a fallback summary based on the data
    const fallbackSummary = generateFallbackSummary(body.formTitle, body.totalResponses, body.fields);

    return NextResponse.json({
      summary: fallbackSummary,
      note: 'Generated using fallback analysis due to AI service unavailability'
    });
  }
}

function generateFallbackSummary(formTitle: string, totalResponses: number, fields: any[]): string {
  const responseRate = totalResponses > 0 ? 'good' : 'no';
  const fieldCount = fields.length;

  let summary = `📊 Form Analysis: "${formTitle}"\n\n`;
  summary += `📈 Response Overview:\n`;
  summary += `• Total responses: ${totalResponses}\n`;
  summary += `• Form fields: ${fieldCount}\n`;
  summary += `• Response rate: ${responseRate} engagement\n\n`;

  if (totalResponses > 0) {
    summary += `🔍 Key Insights:\n`;

    // Analyze field types
    const fieldTypes = fields.reduce((acc: Record<string, number>, field) => {
      acc[field.type] = (acc[field.type] || 0) + 1;
      return acc;
    }, {});

    summary += `• Form composition: ${Object.entries(fieldTypes).map(([type, count]) => `${count} ${type} field${count > 1 ? 's' : ''}`).join(', ')}\n`;

    // Find most responded fields
    const mostResponded = fields
      .filter(f => f.responses && f.responses.length > 0)
      .sort((a, b) => b.responses.length - a.responses.length)
      .slice(0, 3);

    if (mostResponded.length > 0) {
      summary += `• Most engaged fields: ${mostResponded.map(f => f.label).join(', ')}\n`;
    }

    summary += `\n💡 Recommendations:\n`;
    summary += `• Form is collecting data successfully\n`;
    summary += `• Consider analyzing response patterns for optimization\n`;
    summary += `• Monitor completion rates to improve user experience\n`;
  } else {
    summary += `💡 Recommendations:\n`;
    summary += `• Share the form link to start collecting responses\n`;
    summary += `• Consider promoting the form through various channels\n`;
    summary += `• Ensure the form is active and accessible\n`;
  }

  return summary;
}