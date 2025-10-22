'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, ArrowLeft, Wand2 } from 'lucide-react';
import { FormBuilder } from '@/components/form/form-builder';
import { FormPreview } from '@/components/form/form-preview';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Form, FormField } from '@/types/form';
import { toast } from 'sonner';
import Link from 'next/link';

function CreateFormContent() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>({
    title: 'Untitled Form',
    description: 'Form description',
    fields: [],
    isActive: false,
  });

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe what kind of form you want to create');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate form');
      }

      const generatedForm = await response.json();

      setForm({
        ...generatedForm,
        isActive: false,
      });
      setIsModalOpen(false);
      setAiPrompt('');
      toast.success('Form generated successfully!');
    } catch (error) {
      console.error('Error generating form:', error);
      toast.error('Failed to generate form. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormUpdate = (updatedForm: Form) => {
    setForm(updatedForm);
  };

  const handleSaveForm = async () => {
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
      // Get user from auth context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          userId: user.$id,
        }),
      });

      if (response.ok) {
        const savedForm = await response.json();
        toast.success('Form saved successfully!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: type === 'textarea' ? 'Enter your response...' : `Enter ${type}...`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Create Form</h1>
              <p className="text-muted-foreground">Build with AI or design manually</p>
            </div>
          </div>

          {form.fields.length > 0 && (
            <Button onClick={handleSaveForm} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Form
                </>
              )}
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Builder */}
          <div className="space-y-6">
            {/* AI Generate Button */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Generate with AI</h3>
                  <p className="text-sm text-muted-foreground">Describe your form and let AI build it for you</p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-foreground">Generate Form with AI</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="ai-prompt" className="text-sm font-medium mb-2 block">
                          Describe your form
                        </Label>
                        <Textarea
                          id="ai-prompt"
                          placeholder="e.g., Create a customer feedback survey with ratings and comments..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={handleAIGenerate}
                          disabled={isGenerating || !aiPrompt.trim()}
                          className="flex-1"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Generating...
                            </>
                          ) : (
                            'Generate Form'
                          )}
                        </Button>

                        <Button
                          type="button"
                          onClick={() => {
                            setAiPrompt('Create a customer feedback survey with name, email, rating, and comments');
                            setTimeout(() => handleAIGenerate(), 100);
                          }}
                          disabled={isGenerating}
                          variant="outline"
                        >
                          Try Example
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            {/* Manual Form Builder */}
            <FormBuilder
              form={form}
              onFormUpdate={handleFormUpdate}
              onAddField={handleAddField}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">Live Preview</h2>
                <p className="text-sm text-muted-foreground">
                  See exactly how your form will appear to users
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6">
                <FormPreview form={form} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateFormPage() {
  return (
    <ProtectedRoute>
      <CreateFormContent />
    </ProtectedRoute>
  );
}