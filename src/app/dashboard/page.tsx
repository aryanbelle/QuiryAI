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
import { PageLoader } from '@/components/ui/loader';

function DashboardContent() {
  const [forms, setForms] = useState<Form[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
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
    return <PageLoader text="Loading your forms..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name?.split(' ')[0]}
            </p>
          </div>

          <Link href="/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New form
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-none bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Forms</p>
                  <p className="text-2xl font-medium text-foreground">{forms.length}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Responses</p>
                  <p className="text-2xl font-medium text-foreground">{totalResponses}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-2xl font-medium text-foreground">{totalViews}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-medium text-foreground">{activeForms}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forms List */}
        {forms.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">No forms yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first form to get started
            </p>
            <Link href="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create form
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => {
              const stats = getFormStats(form.$id!);
              return (
                <Card key={form.$id} className="border-0 shadow-none bg-card/50 hover:bg-card/80 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-foreground">
                            {form.title}
                          </h3>
                          {form.isActive && (
                            <Badge variant="default" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        
                        {form.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {form.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{form.fields.length} fields</span>
                          <span>{stats.responses} responses</span>
                          <span>{stats.views} views</span>
                          <span>
                            {form.createdAt ? formatDistanceToNow(new Date(form.createdAt), { addSuffix: true }) : 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-6">
                        <Link href={`/analytics/${form.$id}`}>
                          <Button variant="ghost" size="sm">
                            Analytics
                          </Button>
                        </Link>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleCopyLink(form.$id!)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy link
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
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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