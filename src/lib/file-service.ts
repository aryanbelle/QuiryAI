import { serverStorage, FILES_BUCKET_ID, ID } from './appwrite-server';

export class FileService {
  // Upload a file to Appwrite Storage
  static async uploadFile(file: File): Promise<{ fileId: string; fileName: string; fileUrl: string }> {
    try {
      // Create a unique file ID
      const fileId = ID.unique();
      
      // Upload file to Appwrite Storage
      const uploadedFile = await serverStorage.createFile(
        FILES_BUCKET_ID,
        fileId,
        file
      );

      // Get file URL for viewing
      const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${FILES_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

      return {
        fileId: uploadedFile.$id,
        fileName: file.name,
        fileUrl: fileUrl
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Get file URL by file ID
  static getFileUrl(fileId: string): string {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${FILES_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  }

  // Delete a file from storage
  static async deleteFile(fileId: string): Promise<void> {
    try {
      await serverStorage.deleteFile(FILES_BUCKET_ID, fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get file info
  static async getFileInfo(fileId: string) {
    try {
      return await serverStorage.getFile(FILES_BUCKET_ID, fileId);
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }
}