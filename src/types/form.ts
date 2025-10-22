export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  $id?: string;
  title: string;
  description: string;
  fields: FormField[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface FormResponse {
  $id?: string;
  formId: string;
  responses: Record<string, unknown>;
  submittedAt?: string;
}