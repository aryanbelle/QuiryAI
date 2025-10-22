import { NextRequest, NextResponse } from 'next/server';
import { FormsService } from '@/lib/forms-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, we'll use the userId from the request body
    // In a real app, you'd get this from the authenticated session
    const userId = body.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    if (!body.title || !body.fields || body.fields.length === 0) {
      return NextResponse.json(
        { error: 'Title and fields are required' },
        { status: 400 }
      );
    }
    
    const form = await FormsService.createForm(body, userId);
    return NextResponse.json(form, { status: 201 });
  } catch (error: any) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }
    
    const forms = await FormsService.getUserForms(userId);
    return NextResponse.json(forms);
  } catch (error: any) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}