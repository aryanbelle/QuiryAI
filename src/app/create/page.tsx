'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, ArrowLeft, Wand2, Eye, Edit, Type, Mail, Hash, FileText, List, CheckCircle, Circle, Calendar, Upload } from 'lucide-react';
import { FormBuilder } from '@/components/form/form-builder';
import { FormPreview } from '@/components/form/form-preview';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Form, FormField } from '@/types/form';
import { toast } from 'sonner';
import Link from 'next/link';

const fieldTypes = [
  { type: 'text' as const, label: 'Text', icon: Type },
  { type: 'email' as const, label: 'Email', icon: Mail },
  { type: 'number' as const, label: 'Number', icon: Hash },
  { type: 'textarea' as const, label: 'Long Text', icon: FileText },
  { type: 'select' as const, label: 'Dropdown', icon: List },
  { type: 'radio' as const, label: 'Multiple Choice', icon: Circle },
  { type: 'checkbox' as const, label: 'Checkboxes', icon: CheckCircle },
  { type: 'date' as const, label: 'Date', icon: Calendar },
  { type: 'file' as const, label: 'File Upload', icon: Upload },
];

function FormDetailsSection({ form, onFormUpdate }: { form: Form; onFormUpdate: (form: Form) => void }) {
  return (
    <Card className="border-0 shadow-none bg-card/50 p-6">
      <h3 className="text-lg font-medium mb-4">Form Details</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="form-title" className="text-sm font-medium mb-2 block">
            Form Title
          </Label>
          <Input
            id="form-title"
            value={form.title}
            onChange={(e) => onFormUpdate({ ...form, title: e.target.value })}
            placeholder="Enter your form title"
          />
        </div>
        <div>
          <Label htmlFor="form-description" className="text-sm font-medium mb-2 block">
            Description
          </Label>
          <Input
            id="form-description"
            value={form.description}
            onChange={(e) => onFormUpdate({ ...form, description: e.target.value })}
            placeholder="Describe what this form is for"
          />
        </div>
      </div>
    </Card>
  );
}

function AddFieldsSection({ onAddField, onAIGenerate }: { onAddField: (type: FormField['type']) => void; onAIGenerate: () => void }) {
  return (
    <Card className="border-0 shadow-none bg-card/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Add Fields</h3>
        <Button
          onClick={onAIGenerate}
          variant="outline"
          size="sm"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate with AI
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fieldTypes.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            onClick={() => onAddField(type)}
            variant="outline"
            size="sm"
            className="flex items-center justify-start space-x-2 h-10 px-4 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}

function FormBuilderPreviewSection({ form, onFormUpdate }: { form: Form; onFormUpdate: (form: Form) => void }) {
  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: type === 'textarea' ? 'Enter your response...' : `Enter ${type}...`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };

    onFormUpdate({
      ...form,
      fields: [...form.fields, newField],
    });
  };

  return (
    <Card className="border-0 shadow-none bg-card/50 p-6">
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Form Builder</h3>
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="edit" className="text-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="mt-0">
          {form.fields.length > 0 ? (
            <FormBuilder
              form={form}
              onFormUpdate={onFormUpdate}
              onAddField={handleAddField}
            />
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No fields added yet</p>
              <p className="text-sm">Add fields above to start building your form</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="bg-muted/20 rounded-lg p-8">
            <FormPreview form={form} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

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



  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-medium text-foreground">Create Form</h1>
              <p className="text-muted-foreground mt-1">Build with AI or design manually</p>
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

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Form Details */}
          <FormDetailsSection form={form} onFormUpdate={handleFormUpdate} />
          
          {/* Add Fields Section */}
          <AddFieldsSection onAddField={(type) => {
            const newField: FormField = {
              id: `field_${Date.now()}`,
              type,
              label: `New ${type} field`,
              placeholder: type === 'textarea' ? 'Enter your response...' : `Enter ${type}...`,
              required: false,
              options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
            };
            setForm(prev => ({ ...prev, fields: [...prev.fields, newField] }));
          }} onAIGenerate={() => setIsModalOpen(true)} />
          
          {/* Form Builder/Preview Toggle */}
          <FormBuilderPreviewSection 
            form={form} 
            onFormUpdate={handleFormUpdate}
          />
        </div>

        {/* AI Generation Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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