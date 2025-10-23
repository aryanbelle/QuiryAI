'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField } from '@/types/form';
import { toast } from 'sonner';
import { Upload, File, X } from 'lucide-react';

interface FormPreviewProps {
  form: Form;
  onSubmit?: (responses: Record<string, unknown>) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export function FormPreview({ form, onSubmit, isSubmitting = false, readOnly = false }: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const handleInputChange = (fieldId: string, value: unknown) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleFileUpload = async (fieldId: string, file: File) => {
    if (!file) return;

    setUploadingFiles(prev => ({ ...prev, [fieldId]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      
      // Store file info instead of File object
      handleInputChange(fieldId, {
        fileId: result.file.fileId,
        fileName: result.file.fileName,
        fileUrl: result.file.fileUrl,
        originalName: file.name,
        size: file.size,
        type: file.type
      });

      toast.success('File uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldId]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(responses);
    }
  };

  const renderField = (field: FormField) => {
    const value = responses[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value as string}
            onChange={readOnly ? undefined : (e) => handleInputChange(field.id, e.target.value)}
            className="ios-input"
            required={field.required}
            disabled={readOnly}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="ios-textarea"
            required={field.required}
          />
        );

      case 'select':
        return (
          <Select
            value={value as string}
            onValueChange={(val) => handleInputChange(field.id, val)}
            required={field.required}
          >
            <SelectTrigger className="ios-input">
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(val) => handleInputChange(field.id, val)}
            required={field.required}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal text-foreground">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (checked) {
                      handleInputChange(field.id, [...currentValues, option]);
                    } else {
                      handleInputChange(field.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal text-foreground">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value as string}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="ios-input"
            required={field.required}
          />
        );

      case 'file':
        const fileValue = value as any;
        const isUploading = uploadingFiles[field.id];
        
        return (
          <div className="space-y-3">
            {!fileValue && !readOnly && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {field.placeholder || 'Click to upload a file or drag and drop'}
                </p>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(field.id, file);
                    }
                  }}
                  className="hidden"
                  id={`file-${field.id}`}
                  required={field.required}
                  disabled={isUploading}
                />
                <Label 
                  htmlFor={`file-${field.id}`} 
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </Label>
              </div>
            )}
            
            {fileValue && (
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <File className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {fileValue.fileName || fileValue.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileValue.size ? `${Math.round(fileValue.size / 1024)} KB` : 'File uploaded'}
                  </p>
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange(field.id, null)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
            
            {isUploading && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Uploading file...</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (form.fields.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No fields added yet.</p>
        <p className="text-xs mt-1">Add some fields to see the preview.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-3">{form.title}</h1>
        {form.description && (
          <p className="text-muted-foreground">{form.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {renderField(field)}
          </div>
        ))}

        {onSubmit && (
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </form>
    </div>
  );
}