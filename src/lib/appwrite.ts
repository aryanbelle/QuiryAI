import { Client, Databases, Account, ID, Permission, Role, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);
export const account = new Account(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const FORMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID!;
export const RESPONSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID!;

// Helper function to create a client with user session
export function createUserClient(session?: string) {
  const userClient = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  
  if (session) {
    userClient.setSession(session);
  }
  
  return {
    databases: new Databases(userClient),
    account: new Account(userClient)
  };
}

export { client, ID, Permission, Role, Query };