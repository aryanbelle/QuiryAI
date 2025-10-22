import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function generateFormFromPrompt(prompt: string) {
    const systemPrompt = `You are an expert form builder AI. Create a comprehensive form based on the user's requirements.

IMPORTANT: Return ONLY a valid JSON object with NO additional text, explanations, or markdown formatting.

Required JSON structure:
{
  "title": "Descriptive Form Title",
  "description": "Brief description of the form's purpose",
  "fields": [
    {
      "id": "field_1",
      "type": "text|email|number|textarea|select|radio|checkbox|date|file",
      "label": "Clear Field Label",
      "placeholder": "Helpful placeholder text",
      "required": true|false,
      "options": ["option1", "option2", "option3"]
    }
  ]
}

Available field types:
- text: Single line text input
- email: Email address input
- number: Numeric input
- textarea: Multi-line text input
- select: Dropdown selection
- radio: Single choice from options
- checkbox: Multiple choice from options
- date: Date picker
- file: File upload

Guidelines:
1. Create 3-8 relevant fields based on the prompt
2. Use appropriate field types for the data being collected
3. Make required fields logical (name, email usually required)
4. Provide helpful placeholder text
5. For select/radio/checkbox, include 3-5 relevant options
6. Generate unique sequential IDs (field_1, field_2, etc.)
7. Only include "options" property for select, radio, and checkbox types

User request: "${prompt}"`;

    try {
        const result = await model.generateContent(systemPrompt);
        const response = result.response;
        let text = response.text().trim();

        // Clean up the response - remove any markdown formatting
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Find JSON object in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const parsedForm = JSON.parse(jsonStr);

            // Validate the structure
            if (!parsedForm.title || !parsedForm.description || !Array.isArray(parsedForm.fields)) {
                throw new Error('Invalid form structure generated');
            }

            return parsedForm;
        }

        throw new Error('No valid JSON found in response');
    } catch (error) {
        console.error('Error generating form:', error);
        throw error;
    }
}