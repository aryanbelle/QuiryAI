'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormBuilder } from '@/components/form/form-builder';
import { FormPreview } from '@/components/form/form-preview';
import { Form, FormField } from '@/types/form';
import { toast } from 'sonner';
import { Save, Eye } from 'lucide-react';

export default function EditFormPage() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchForm(params.id as string);
    }
  }, [params.id]);

  const fetchForm = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data);
      } else {
        toast.error('Form not found');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleFormUpdate = (updatedForm: Form) => {
    setForm(updatedForm);
  };

  const handleAddField = (type: FormField['type']) => {
    if (!form) return;

    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: type === 'textarea' ? 'Enter your response...' : `Enter ${type}...`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };

    setForm(prev => prev ? ({
      ...prev,
      fields: [...prev.fields, newField],
    }) : null);
  };

  const handleSaveForm = async () => {
    if (!form) return;

    if (!form.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    if (form.fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }

    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch(`/api/forms/${form.$id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          userId: user.$id,
        }),
      });

      if (response.ok) {
        toast.success('Form updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update form');
      }
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Failed to update form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-48"></Card>
                ))}
              </div>
              <Card className="h-96"></Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Form Not Found</h1>
            <p className="text-muted-foreground">The form you're trying to edit doesn't exist.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Form</h1>
            <p className="text-muted-foreground">Make changes to your form</p>
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => window.open(`/form/${form.$id}`, '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button 
              onClick={handleSaveForm}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Builder */}
          <div className="space-y-6">
            <FormBuilder 
              form={form} 
              onFormUpdate={handleFormUpdate}
              onAddField={handleAddField}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Live Preview</CardTitle>
                <CardDescription className="text-muted-foreground">
                  See how your form will look to respondents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormPreview form={form} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}