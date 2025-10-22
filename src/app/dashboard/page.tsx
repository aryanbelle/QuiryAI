'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  BarChart3,
  MoreVertical,
  Copy,
  Power,
  PowerOff,
  Users,
  TrendingUp
} from 'lucide-react';
import { Form } from '@/types/form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

// Mock data for demo
const mockForms: Form[] = [
  {
    $id: '1',
    title: 'Customer Feedback Survey',
    description: 'Collect valuable feedback from our customers about their experience',
    fields: [
      { id: '1', type: 'text', label: 'Name', required: true, placeholder: 'Your name' },
      { id: '2', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
      { id: '3', type: 'radio', label: 'Rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
      { id: '4', type: 'textarea', label: 'Comments', required: false, placeholder: 'Additional comments' }
    ],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    $id: '2',
    title: 'Event Registration',
    description: 'Register for our upcoming tech conference',
    fields: [
      { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
      { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'your@email.com' },
      { id: '3', type: 'select', label: 'Session Track', required: true, options: ['Frontend', 'Backend', 'DevOps', 'AI/ML'] },
      { id: '4', type: 'checkbox', label: 'Dietary Preferences', required: false, options: ['Vegetarian', 'Vegan', 'Gluten-free'] }
    ],
    isActive: true,
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    $id: '3',
    title: 'Job Application Form',
    description: 'Apply for open positions at our company',
    fields: [
      { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Your full name' },
      { id: '2', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
      { id: '3', type: 'select', label: 'Position', required: true, options: ['Frontend Developer', 'Backend Developer', 'Designer', 'Product Manager'] },
      { id: '4', type: 'file', label: 'Resume', required: true },
      { id: '5', type: 'textarea', label: 'Cover Letter', required: false, placeholder: 'Tell us about yourself' }
    ],
    isActive: false,
    createdAt: '2024-01-05T09:15:00Z'
  }
];

function DashboardContent() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load mock data for demo
    setTimeout(() => {
      setForms(mockForms);
      setLoading(false);
    }, 500);
  }, []);

  const handleToggleActive = (formId: string, isActive: boolean) => {
    setForms(forms.map(form => 
      form.$id === formId ? { ...form, isActive: !isActive } : form
    ));
    toast.success(`Form ${!isActive ? 'activated' : 'deactivated'}`);
  };

  const handleDeleteForm = (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    
    setForms(forms.filter(form => form.$id !== formId));
    toast.success('Form deleted successfully');
  };

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    toast.success('Form link copied to clipboard');
  };

  // Mock analytics data
  const getFormStats = (formId: string) => {
    const stats = {
      '1': { responses: 127, views: 340 },
      '2': { responses: 89, views: 156 },
      '3': { responses: 23, views: 67 }
    };
    return stats[formId as keyof typeof stats] || { responses: 0, views: 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-64"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>
              <div className="h-10 bg-muted rounded w-32"></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Table skeleton */}
            <Card>
              <div className="p-4 space-y-4">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-4 bg-muted rounded flex-1"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-muted-foreground">Let&apos;s build something incredible today</p>
          </div>
          
          <Link href="/create">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Form</span>
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Forms</p>
                <p className="text-2xl font-bold text-foreground">{forms.length}</p>
                <p className="text-xs text-primary mt-1">+2 this week</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Responses</p>
                <p className="text-2xl font-bold text-foreground">
                  {forms.reduce((acc, form) => acc + getFormStats(form.$id!).responses, 0)}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% growth</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Forms</p>
                <p className="text-2xl font-bold text-foreground">
                  {forms.filter(form => form.isActive).length}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {Math.round((forms.filter(form => form.isActive).length / forms.length) * 100)}% active
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Forms Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Forms</h2>
          <p className="text-muted-foreground">Manage and track all your forms in one place</p>
        </div>

        {forms.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No forms created yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get started by creating your first form and begin collecting responses
            </p>
            <Link href="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </Link>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-foreground">Form</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Responses</th>
                    <th className="text-left p-4 font-medium text-foreground">Created</th>
                    <th className="text-left p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form) => {
                    const stats = getFormStats(form.$id!);
                    return (
                      <tr key={form.$id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              {form.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {form.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {form.fields.length} fields
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={form.isActive ? "default" : "secondary"}>
                            {form.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-lg font-semibold text-foreground">
                              {stats.responses}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stats.views} views
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-muted-foreground">
                            {form.createdAt ? formatDistanceToNow(new Date(form.createdAt), { addSuffix: true }) : 'Unknown'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Link href={`/form/${form.$id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            
                            <Link href={`/edit/${form.$id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleCopyLink(form.$id!)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleActive(form.$id!, form.isActive)}>
                                  {form.isActive ? (
                                    <>
                                      <PowerOff className="w-4 h-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Power className="w-4 h-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteForm(form.$id!)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}