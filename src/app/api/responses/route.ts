import { NextRequest, NextResponse } from 'next/server';
import { ResponsesService } from '@/lib/responses-service';
import { FormsService } from '@/lib/forms-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, responses } = body;
    
    if (!formId || !responses) {
      return NextResponse.json(
        { error: 'Form ID and responses are required' },
        { status: 400 }
      );
    }

    // Check if form exists and is active
    try {
      const form = await FormsService.getForm(formId);
      if (!form.isActive) {
        return NextResponse.json(
          { error: 'This form is no longer accepting responses' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Get IP address for tracking (optional)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    const response = await ResponsesService.submitResponse(formId, responses, ip);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting response:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    
    console.log('Fetching responses for formId:', formId);
    
    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID required' },
        { status: 400 }
      );
    }
    
    const responses = await ResponsesService.getFormResponses(formId);
    console.log('Found responses:', responses.length);
    
    return NextResponse.json(responses);
  } catch (error: any) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responses', details: error.message },
      { status: 500 }
    );
  }
}