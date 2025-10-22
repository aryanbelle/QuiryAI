import { NextRequest, NextResponse } from 'next/server';
import { ResponsesService } from '@/lib/responses-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    
    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID required' },
        { status: 400 }
      );
    }
    
    const responses = await ResponsesService.getFormResponses(formId);
    const count = responses.length;
    
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Error fetching response count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch response count', details: error.message },
      { status: 500 }
    );
  }
}