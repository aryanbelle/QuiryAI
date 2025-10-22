import { account } from './appwrite';
import { ID } from 'appwrite';

export interface User {
  $id: string;
  name: string;
  email: string;
}

export class AuthService {
  // Sign up new user
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      // Create account
      const user = await account.create(ID.unique(), email, password, name);
      
      // Create session (auto login after signup)
      await account.createEmailPasswordSession(email, password);
      
      return {
        $id: user.$id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string): Promise<User> {
    try {
      // Create session
      await account.createEmailPasswordSession(email, password);
      
      // Get user details
      const user = await account.get();
      
      return {
        $id: user.$id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return {
        $id: user.$id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      return null;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();