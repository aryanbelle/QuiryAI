import { NextRequest, NextResponse } from 'next/server';
import { FormsService } from '@/lib/forms-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await FormsService.getForm(params.id);
    return NextResponse.json(form);
  } catch (error: any) {
    console.error('Error fetching form:', error);
    
    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const updatedForm = await FormsService.updateForm(params.id, body, userId);
    return NextResponse.json(updatedForm);
  } catch (error: any) {
    console.error('Error updating form:', error);
    
    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await FormsService.deleteForm(params.id);
    return NextResponse.json({ 
      success: true, 
      message: 'Form deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting form:', error);
    
    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    );
  }
}