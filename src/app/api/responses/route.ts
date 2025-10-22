import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { FormResponse } from '@/types/form';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    const queries = formId ? [Query.equal('formId', formId)] : [];
    
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID!,
      queries
    );

    return NextResponse.json(response.documents);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const responseData: FormResponse = await request.json();
    
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID!,
      ID.unique(),
      {
        ...responseData,
        submittedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Failed to create response' }, { status: 500 });
  }
}