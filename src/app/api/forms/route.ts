import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Form } from '@/types/form';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const queries = userId ? [Query.equal('userId', userId)] : [];
    
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID!,
      queries
    );

    return NextResponse.json(response.documents);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: Form = await request.json();
    
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID!,
      ID.unique(),
      {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}