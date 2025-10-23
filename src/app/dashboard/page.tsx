'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Plus,
  FileText,
  BarChart3,
  Trash2,
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



function DashboardContent() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`/api/forms?userId=${user.$id}`);
      if (response.ok) {
        const formsData = await response.json();
        setForms(formsData);
        
        // Fetch response counts for each form
        await fetchResponseCounts(formsData);
      } else {
        toast.error('Failed to load forms');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const fetchResponseCounts = async (formsData: Form[]) => {
    try {
      const counts: Record<string, number> = {};
      
      // Fetch response count for each form
      await Promise.all(
        formsData.map(async (form) => {
          try {
            const response = await fetch(`/api/responses/count?formId=${form.$id}`);
            if (response.ok) {
              const data = await response.json();
              counts[form.$id!] = data.count;
            } else {
              counts[form.$id!] = 0;
            }
          } catch (error) {
            console.error(`Error fetching count for form ${form.$id}:`, error);
            counts[form.$id!] = 0;
          }
        })
      );
      
      setResponseCounts(counts);
    } catch (error) {
      console.error('Error fetching response counts:', error);
    }
  };

  const handleToggleActive = async (formId: string, isActive: boolean) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !isActive,
          userId: user.$id,
        }),
      });

      if (response.ok) {
        setForms(forms.map(form =>
          form.$id === formId ? { ...form, isActive: !isActive } : form
        ));
        toast.success(`Form ${!isActive ? 'activated' : 'deactivated'}`);
      } else {
        toast.error('Failed to update form');
      }
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Failed to update form');
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setForms(forms.filter(form => form.$id !== formId));
        toast.success('Form deleted successfully');
      } else {
        toast.error('Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    }
  };

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    toast.success('Form link copied to clipboard');
  };

  // Get real form stats
  const getFormStats = (formId: string) => {
    return {
      responses: responseCounts[formId] || 0,
      views: 0 // Views tracking can be implemented later
    };
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
                  {Object.values(responseCounts).reduce((acc, count) => acc + count, 0)}
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
                            <Link href={`/analytics/${form.$id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Analytics">
                                <BarChart3 className="w-4 h-4" />
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