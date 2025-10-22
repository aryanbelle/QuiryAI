import { serverDatabases as databases, DATABASE_ID, FORMS_COLLECTION_ID, ID, Permission, Role, Query } from './appwrite-server';
import { Form } from '@/types/form';

export class FormsService {
  // Create a new form
  static async createForm(form: Omit<Form, '$id' | '$createdAt' | '$updatedAt'>, userId: string) {
    try {
      const result = await databases.createDocument(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        ID.unique(),
        {
          title: form.title,
          description: form.description || '',
          fields: JSON.stringify(form.fields),
          isActive: form.isActive !== undefined ? form.isActive : true,
          userId: userId
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      );

      return this.transformDocument(result);
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  }

  // Get a form by ID (public access for form viewing)
  static async getForm(formId: string) {
    try {
      const result = await databases.getDocument(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        formId
      );

      return this.transformDocument(result);
    } catch (error) {
      console.error('Error getting form:', error);
      throw error;
    }
  }

  // Get all forms for a user
  static async getUserForms(userId: string) {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );

      return result.documents.map(doc => this.transformDocument(doc));
    } catch (error) {
      console.error('Error getting user forms:', error);
      throw error;
    }
  }

  // Update a form
  static async updateForm(formId: string, updates: Partial<Form>, userId: string) {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.fields !== undefined) updateData.fields = JSON.stringify(updates.fields);
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

      const result = await databases.updateDocument(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        formId,
        updateData
      );

      return this.transformDocument(result);
    } catch (error) {
      console.error('Error updating form:', error);
      throw error;
    }
  }

  // Delete a form
  static async deleteForm(formId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        formId
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting form:', error);
      throw error;
    }
  }

  // Transform Appwrite document to our Form type
  private static transformDocument(doc: any): Form {
    return {
      $id: doc.$id,
      title: doc.title,
      description: doc.description,
      fields: JSON.parse(doc.fields),
      isActive: doc.isActive ?? true, // Handle null case
      userId: doc.userId,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt
    };
  }
}