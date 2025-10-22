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
import { SortableItem, DragHandle } from './sortable-item';

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
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );



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
    <div className="space-y-3">
      {form.fields.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">Form Fields</h4>
            <span className="text-xs text-muted-foreground">Drag to reorder</span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={form.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {form.fields.map((field) => (
                  <SortableItem key={field.id} id={field.id}>
                    <div className="field-item border border-border rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <DragHandle>
                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                          </DragHandle>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
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
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {/* Field Label & Placeholder in a grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium mb-1 block text-muted-foreground">
                              Field Label
                            </Label>
                            <Input
                              value={field.label}
                              onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                              placeholder="Enter field label"
                              onFocus={() => setEditingField(`${field.id}-label`)}
                              onBlur={() => setEditingField(null)}
                              className={`h-8 ${editingField === `${field.id}-label` ? 'ring-2 ring-primary' : ''}`}
                            />
                          </div>

                          <div>
                            <Label className="text-xs font-medium mb-1 block text-muted-foreground">
                              Placeholder Text
                            </Label>
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => handleFieldUpdate(field.id, { placeholder: e.target.value })}
                              placeholder="Enter placeholder text"
                              onFocus={() => setEditingField(`${field.id}-placeholder`)}
                              onBlur={() => setEditingField(null)}
                              className={`h-8 ${editingField === `${field.id}-placeholder` ? 'ring-2 ring-primary' : ''}`}
                            />
                          </div>
                        </div>

                        {/* Options for select, radio, checkbox */}
                        {['select', 'radio', 'checkbox'].includes(field.type) && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-xs font-medium text-muted-foreground">
                                Options
                              </Label>
                              <Button
                                onClick={() => handleAddOption(field.id)}
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                              </Button>
                            </div>

                            <div className="space-y-1.5">
                              {(field.options || []).map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => handleUpdateOption(field.id, index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className={`flex-1 h-7 text-sm ${editingField === `${field.id}-option-${index}` ? 'ring-2 ring-primary' : ''}`}
                                    onFocus={() => setEditingField(`${field.id}-option-${index}`)}
                                    onBlur={() => setEditingField(null)}
                                  />
                                  <Button
                                    onClick={() => handleDeleteOption(field.id, index)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}

                              {(!field.options || field.options.length === 0) && (
                                <div className="text-xs text-muted-foreground py-1">
                                  No options added yet. Click "Add" to get started.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Required Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`required-${field.id}`}
                              checked={field.required}
                              onChange={(e) => handleFieldUpdate(field.id, { required: e.target.checked })}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor={`required-${field.id}`} className="text-xs font-medium text-muted-foreground">
                              Required field
                            </Label>
                          </div>
                          {field.required && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">Required</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}