'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Form, FormResponse } from '@/types/form';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Users, TrendingUp, Download } from 'lucide-react';

const COLORS = ['#0066FF', '#00C851', '#FF6B35', '#FFD700', '#8E44AD', '#E74C3C'];

export default function AnalyticsPage() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchData(params.id as string);
    }
  }, [params.id]);

  const fetchData = async (formId: string) => {
    try {
      const [formResponse, responsesResponse] = await Promise.all([
        fetch(`/api/forms/${formId}`),
        fetch(`/api/responses?formId=${formId}`)
      ]);

      if (formResponse.ok && responsesResponse.ok) {
        const formData = await formResponse.json();
        const responsesData = await responsesResponse.json();
        
        setForm(formData);
        setResponses(responsesData);
      } else {
        toast.error('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getFieldAnalytics = (fieldId: string) => {
    const field = form?.fields.find(f => f.id === fieldId);
    if (!field) return null;

    const fieldResponses = responses
      .map(r => r.responses[fieldId])
      .filter(Boolean) as string[];

    if (['select', 'radio'].includes(field.type)) {
      const counts = fieldResponses.reduce((acc: Record<string, number>, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (field.type === 'checkbox') {
      const allOptions: string[] = [];
      fieldResponses.forEach(response => {
        if (Array.isArray(response)) {
          allOptions.push(...response);
        }
      });

      const counts = allOptions.reduce((acc: Record<string, number>, option) => {
        acc[option] = (acc[option] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    return null;
  };

  const getResponsesOverTime = () => {
    const responsesByDate = responses.reduce((acc: Record<string, number>, response) => {
      if (response.submittedAt) {
        const date = new Date(response.submittedAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(responsesByDate)
      .map(([date, count]) => ({ date, responses: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const exportData = () => {
    if (!form || responses.length === 0) return;

    const csvHeaders = ['Submitted At', ...form.fields.map(f => f.label)];
    const csvRows = responses.map(response => [
      response.submittedAt || '',
      ...form.fields.map(field => {
        const value = response.responses[field.id];
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value || '';
      })
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-32"></Card>
              ))}
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
            <p className="text-muted-foreground">The form you&apos;re looking for doesn&apos;t exist.</p>
          </Card>
        </div>
      </div>
    );
  }

  const responsesOverTime = getResponsesOverTime();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
            <p className="text-muted-foreground">{form.title}</p>
          </div>
          
          <Button onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{responses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Form Status</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={form.isActive ? "default" : "secondary"}>
                {form.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Created</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {form.createdAt ? formatDistanceToNow(new Date(form.createdAt), { addSuffix: true }) : 'Unknown'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fields">Field Analysis</TabsTrigger>
            <TabsTrigger value="responses">Recent Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {responsesOverTime.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Responses Over Time</CardTitle>
                  <CardDescription className="text-muted-foreground">Daily response count</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={responsesOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="responses" stroke="#0066FF" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="fields" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {form.fields.map((field) => {
                const analytics = getFieldAnalytics(field.id);
                if (!analytics || analytics.length === 0) return null;

                return (
                  <Card key={field.id}>
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{field.label}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {responses.filter(r => r.responses[field.id]).length} responses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics.length <= 6 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={analytics}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {analytics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={analytics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#0066FF" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Recent Responses</CardTitle>
                <CardDescription className="text-muted-foreground">Latest form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {responses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No responses yet</p>
                ) : (
                  <div className="space-y-4">
                    {responses.slice(0, 10).map((response, index) => (
                      <div key={response.$id || index} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-foreground">Response #{responses.length - index}</span>
                          <span className="text-xs text-muted-foreground">
                            {response.submittedAt ? formatDistanceToNow(new Date(response.submittedAt), { addSuffix: true }) : 'Unknown time'}
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {form.fields.map((field) => {
                            const value = response.responses[field.id];
                            if (!value) return <div key={field.id}></div>;
                            
                            return (
                              <div key={field.id} className="text-sm">
                                <span className="font-medium text-foreground">{field.label}:</span>{' '}
                                <span className="text-muted-foreground">
                                  {Array.isArray(value) ? value.join(', ') : value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}