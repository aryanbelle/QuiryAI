import { Client, Databases, Storage, ID, Permission, Role, Query } from 'node-appwrite';

const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const serverDatabases = new Databases(serverClient);
export const serverStorage = new Storage(serverClient);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const FORMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID!;
export const RESPONSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID!;

// Storage Bucket ID
export const FILES_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID!;

export { serverClient, ID, Permission, Role, Query };