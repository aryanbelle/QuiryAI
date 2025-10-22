import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases as databases, DATABASE_ID, RESPONSES_COLLECTION_ID } from '@/lib/appwrite-server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing direct database access...');
    console.log('Database ID:', DATABASE_ID);
    console.log('Collection ID:', RESPONSES_COLLECTION_ID);
    
    // Get all responses without any filters
    const result = await databases.listDocuments(
      DATABASE_ID,
      RESPONSES_COLLECTION_ID
    );
    
    console.log('Total documents in collection:', result.total);
    console.log('Documents found:', result.documents.length);
    console.log('Raw documents:', result.documents);
    
    return NextResponse.json({
      success: true,
      total: result.total,
      documents: result.documents,
      databaseId: DATABASE_ID,
      collectionId: RESPONSES_COLLECTION_ID
    });
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      type: error.type
    }, { status: 500 });
  }
}