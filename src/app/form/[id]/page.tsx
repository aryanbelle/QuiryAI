'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { FormPreview } from '@/components/form/form-preview';
import { Form } from '@/types/form';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function PublicFormPage() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        
        if (!data.isActive) {
          toast.error('This form is no longer accepting responses');
        }
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

  const handleSubmit = async (responses: Record<string, unknown>) => {
    if (!form || !form.isActive) {
      toast.error('This form is not accepting responses');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: form.$id,
          responses,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Response submitted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Form Not Found</h1>
            <p className="text-muted-foreground">The form you're looking for doesn't exist or has been removed.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-16">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-foreground mb-4">Thank You!</h1>
              <p className="text-muted-foreground text-lg">
                Your response has been submitted successfully.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!form.isActive) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Form Inactive</h1>
            <p className="text-muted-foreground">This form is no longer accepting responses.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8">
            <FormPreview 
              form={form} 
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}