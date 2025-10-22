import { NextRequest, NextResponse } from 'next/server';
import { generateFormFromPrompt } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const form = await generateFormFromPrompt(prompt);
    return NextResponse.json(form);
  } catch (error) {
    console.error('Error generating form:', error);
    return NextResponse.json({ error: 'Failed to generate form' }, { status: 500 });
  }
}