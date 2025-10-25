'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  TrendingUp,
  Eye,
  Calendar,
  Activity
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
      views: Math.floor(Math.random() * 100) + 10 // Mock views for now
    };
  };

  const totalResponses = Object.values(responseCounts).reduce((acc, count) => acc + count, 0);
  const activeForms = forms.filter(form => form.isActive).length;
  const totalViews = forms.reduce((acc, form) => acc + getFormStats(form.$id!).views, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-7 bg-muted rounded w-64"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>
              <div className="h-9 bg-muted rounded w-28"></div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 w-4 bg-muted rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded w-12 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Table skeleton */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32"></div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, {user?.name?.split(' ')[0]}. Here's what's happening with your forms.
            </p>
          </div>

          <Link href="/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Form
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeForms} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponses}</div>
              <p className="text-xs text-muted-foreground">
                Across all forms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Form page visits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Responses per view
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Forms Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Forms</CardTitle>
            <CardDescription>
              Manage and monitor your form collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No forms created yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Get started by creating your first form and begin collecting responses from your audience.
                </p>
                <Link href="/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Form
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Form</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Responses</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Views</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Created</th>
                      <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((form) => {
                      const stats = getFormStats(form.$id!);
                      const conversionRate = stats.views > 0 ? Math.round((stats.responses / stats.views) * 100) : 0;
                      
                      return (
                        <tr key={form.$id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-foreground mb-1 truncate">
                                  {form.title}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                                  {form.description || 'No description'}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <span>{form.fields.length} fields</span>
                                  <span>•</span>
                                  <span>{conversionRate}% conversion</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={form.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {form.isActive ? (
                                <>
                                  <Activity className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                'Inactive'
                              )}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm font-medium text-foreground">
                              {stats.responses}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-muted-foreground">
                              {stats.views}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {form.createdAt ? formatDistanceToNow(new Date(form.createdAt), { addSuffix: true }) : 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-1">
                              <Link href={`/analytics/${form.$id}`}>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <BarChart3 className="w-4 h-4" />
                                </Button>
                              </Link>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleCopyLink(form.$id!)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Form Link
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleActive(form.$id!, form.isActive)}>
                                    {form.isActive ? (
                                      <>
                                        <PowerOff className="w-4 h-4 mr-2" />
                                        Deactivate Form
                                      </>
                                    ) : (
                                      <>
                                        <Power className="w-4 h-4 mr-2" />
                                        Activate Form
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteForm(form.$id!)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Form
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
            )}
          </CardContent>
        </Card>
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