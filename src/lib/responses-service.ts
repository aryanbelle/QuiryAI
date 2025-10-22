import { serverDatabases as databases, DATABASE_ID, RESPONSES_COLLECTION_ID, FORMS_COLLECTION_ID, ID, Permission, Role, Query } from './appwrite-server';
import { FormResponse } from '@/types/form';

export class ResponsesService {
  // Submit a form response (public access)
  static async submitResponse(formId: string, responses: Record<string, unknown>, ipAddress?: string) {
    try {
      const result = await databases.createDocument(
        DATABASE_ID,
        RESPONSES_COLLECTION_ID,
        ID.unique(),
        {
          formId: formId,
          responses: JSON.stringify(responses),
          submittedAt: new Date().toISOString(),
          ipAddress: ipAddress || null
        }
        // No permissions - rely on collection-level permissions
      );

      return this.transformDocument(result);
    } catch (error) {
      console.error('Error submitting response:', error);
      throw error;
    }
  }

  // Get responses for a form (only form owner can access)
  static async getFormResponses(formId: string) {
    try {
      console.log('Querying responses for formId:', formId);
      console.log('Using database:', DATABASE_ID);
      console.log('Using collection:', RESPONSES_COLLECTION_ID);
      
      const result = await databases.listDocuments(
        DATABASE_ID,
        RESPONSES_COLLECTION_ID,
        [
          Query.equal('formId', formId),
          Query.orderDesc('$createdAt')
        ]
      );

      console.log('Raw result from Appwrite:', result);
      console.log('Number of documents found:', result.documents.length);

      return result.documents.map(doc => this.transformDocument(doc));
    } catch (error) {
      console.error('Error getting form responses:', error);
      console.error('Error details:', error);
      throw error;
    }
  }

  // Get a single response
  static async getResponse(responseId: string) {
    try {
      const result = await databases.getDocument(
        DATABASE_ID,
        RESPONSES_COLLECTION_ID,
        responseId
      );

      return this.transformDocument(result);
    } catch (error) {
      console.error('Error getting response:', error);
      throw error;
    }
  }

  // Delete a response (only form owner)
  static async deleteResponse(responseId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        RESPONSES_COLLECTION_ID,
        responseId
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting response:', error);
      throw error;
    }
  }

  // Transform Appwrite document to our FormResponse type
  private static transformDocument(doc: any): FormResponse {
    return {
      $id: doc.$id,
      formId: doc.formId,
      responses: JSON.parse(doc.responses),
      submittedAt: doc.submittedAt || doc.$createdAt,
      ipAddress: doc.ipAddress,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt
    };
  }
}