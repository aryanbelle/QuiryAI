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

interface FormPreviewProps {
  form: Form;
  onSubmit?: (responses: Record<string, unknown>) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export function FormPreview({ form, onSubmit, isSubmitting = false, readOnly = false }: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, unknown>>({});

  const handleInputChange = (fieldId: string, value: unknown) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value,
    }));
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
        return (
          <Input
            type="file"
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
            className="ios-input"
            required={field.required}
          />
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