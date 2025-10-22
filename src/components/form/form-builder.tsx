'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Type,
  Mail,
  Hash,
  FileText,
  List,
  CheckCircle,
  Circle,
  Calendar,
  Upload,
  Trash2,
  GripVertical,
  Plus,
  X
} from 'lucide-react';
import { Form, FormField } from '@/types/form';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

interface FormBuilderProps {
  form: Form;
  onFormUpdate: (form: Form) => void;
  onAddField: (type: FormField['type']) => void;
}

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

export function FormBuilder({ form, onFormUpdate, onAddField }: FormBuilderProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFormInfoUpdate = (field: 'title' | 'description', value: string) => {
    onFormUpdate({
      ...form,
      [field]: value,
    });
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = form.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onFormUpdate({
      ...form,
      fields: updatedFields,
    });
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = form.fields.filter(field => field.id !== fieldId);
    onFormUpdate({
      ...form,
      fields: updatedFields,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex(field => field.id === active.id);
      const newIndex = form.fields.findIndex(field => field.id === over.id);

      const newFields = arrayMove(form.fields, oldIndex, newIndex);
      onFormUpdate({
        ...form,
        fields: newFields,
      });
    }
  };

  const handleAddOption = (fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (!field) return;

    const currentOptions = field.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    handleFieldUpdate(fieldId, { options: newOptions });
  };

  const handleUpdateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = [...field.options];
    newOptions[optionIndex] = value;
    handleFieldUpdate(fieldId, { options: newOptions });
  };

  const handleDeleteOption = (fieldId: string, optionIndex: number) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = field.options.filter((_, index) => index !== optionIndex);
    handleFieldUpdate(fieldId, { options: newOptions });
  };



  return (
    <div className="space-y-6">
      {/* Form Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Form Details</h3>
        <div className="space-y-6">
          <div>
            <Label htmlFor="form-title" className="text-sm font-medium mb-2 block">
              Form Title
            </Label>
            <Input
              id="form-title"
              value={form.title}
              onChange={(e) => handleFormInfoUpdate('title', e.target.value)}
              placeholder="Enter your form title"
            />
          </div>

          <div>
            <Label htmlFor="form-description" className="text-sm font-medium mb-2 block">
              Description
            </Label>
            <Textarea
              id="form-description"
              value={form.description}
              onChange={(e) => handleFormInfoUpdate('description', e.target.value)}
              placeholder="Describe what this form is for"
            />
          </div>
        </div>
      </Card>
      {/* Field Types */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Add Fields</h3>
        <div className="grid grid-cols-3 gap-4">
          {fieldTypes.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              onClick={() => onAddField(type)}
              variant="outline"
              className="flex flex-col items-center space-y-3 h-auto py-6"
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Form Fields */}
      {form.fields.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Form Fields</h3>
            <span className="text-sm text-muted-foreground">Drag to reorder • Click to edit</span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={form.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {form.fields.map((field) => (
                  <SortableItem key={field.id} id={field.id}>
                    <div className="field-item">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {fieldTypes.find(t => t.type === field.type)?.label}
                          </span>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFieldDelete(field.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                        {/* Field Label */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Field Label
                          </Label>
                          <Input
                            value={field.label}
                            onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                            placeholder="Enter field label"
                          />
                        </div>

                        {/* Placeholder Text */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Placeholder Text
                          </Label>
                          <Input
                            value={field.placeholder || ''}
                            onChange={(e) => handleFieldUpdate(field.id, { placeholder: e.target.value })}
                            placeholder="Enter placeholder text"
                          />
                        </div>

                        {/* Options for select, radio, checkbox */}
                        {['select', 'radio', 'checkbox'].includes(field.type) && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">
                                Options
                              </Label>
                              <Button
                                onClick={() => handleAddOption(field.id)}
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {(field.options || []).map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => handleUpdateOption(field.id, index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1"
                                  />
                                  <Button
                                    onClick={() => handleDeleteOption(field.id, index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}

                              {(!field.options || field.options.length === 0) && (
                                <div className="text-sm text-muted-foreground py-2">
                                  No options added yet. Click "Add Option" to get started.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Required Toggle */}
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`required-${field.id}`}
                            checked={field.required}
                            onChange={(e) => handleFieldUpdate(field.id, { required: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor={`required-${field.id}`} className="text-sm font-medium">
                            Required field
                          </Label>
                          {field.required && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive">Required</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Card>
      )}
    </div>
  );
}