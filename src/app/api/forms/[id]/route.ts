import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { Form } from '@/types/form';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID!,
      params.id
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData: Partial<Form> = await request.json();
    
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID!,
      params.id,
      {
        ...formData,
        updatedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID!,
      params.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}