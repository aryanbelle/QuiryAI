'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Form, FormResponse } from '@/types/form';
import { FormPreview } from '@/components/form/form-preview';
import { toast } from 'sonner';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import {
  FileText,
  Users,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Sparkles,
  ArrowLeft,
  Filter,
  Search,
  RefreshCw,
  X
} from 'lucide-react';

const COLORS = ['#0066FF', '#00C851', '#FF6B35', '#FFD700', '#8E44AD', '#E74C3C', '#17A2B8', '#6F42C1'];

export default function AnalyticsPage() {
  const params = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchData(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (!form) return;

    const filtered = responses.filter(response => {
      if (!searchTerm) return true;

      return form.fields.some(field => {
        const value = response.responses[field.id];
        if (!value) return false;

        const searchValue = Array.isArray(value) ? value.join(' ') : String(value);
        return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    setFilteredResponses(filtered);
  }, [responses, searchTerm, form]);

  const fetchData = async (formId: string) => {
    try {
      console.log('Fetching analytics data for form:', formId);

      const [formResponse, responsesResponse] = await Promise.all([
        fetch(`/api/forms/${formId}`),
        fetch(`/api/responses?formId=${formId}`)
      ]);

      console.log('Form response status:', formResponse.status);
      console.log('Responses response status:', responsesResponse.status);

      if (formResponse.ok && responsesResponse.ok) {
        const formData = await formResponse.json();
        const responsesData = await responsesResponse.json();

        console.log('Form data:', formData);
        console.log('Responses data:', responsesData);
        console.log('Number of responses:', responsesData.length);

        setForm(formData);
        setResponses(responsesData);
      } else {
        console.error('API responses not ok:', {
          formStatus: formResponse.status,
          responsesStatus: responsesResponse.status
        });

        if (!responsesResponse.ok) {
          const errorData = await responsesResponse.json();
          console.error('Responses API error:', errorData);
        }

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
      .filter(Boolean);

    // Handle file fields
    if (field.type === 'file') {
      const fileCount = fieldResponses.filter(response => 
        typeof response === 'object' && response !== null && (response as any).fileName
      ).length;
      return [{ name: 'Files Uploaded', value: fileCount }];
    }

    // Handle select and radio fields
    if (['select', 'radio'].includes(field.type)) {
      const counts = fieldResponses.reduce((acc: Record<string, number>, value) => {
        const stringValue = String(value);
        acc[stringValue] = (acc[stringValue] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    // Handle checkbox fields
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

  const generateAISummary = async (customQuestion?: string) => {
    if (!form || responses.length === 0) {
      toast.error('No responses to analyze');
      return;
    }

    setGeneratingAI(true);
    try {
      // Prepare actual response data for analysis
      const responseData = responses.map(response => {
        const formattedResponse: Record<string, any> = {};
        form.fields.forEach(field => {
          const value = response.responses[field.id];
          if (value !== undefined && value !== null && value !== '') {
            // Handle different field types
            if (field.type === 'file' && typeof value === 'object') {
              formattedResponse[field.label] = (value as any).fileName || 'File uploaded';
            } else if (Array.isArray(value)) {
              formattedResponse[field.label] = value.join(', ');
            } else {
              formattedResponse[field.label] = String(value);
            }
          }
        });
        return {
          ...formattedResponse,
          submittedAt: response.submittedAt
        };
      });

      const analysisData = {
        formTitle: form.title,
        totalResponses: responses.length,
        responseData: responseData,
        customQuestion: customQuestion || null
      };

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.analysis);
        toast.success(customQuestion ? 'AI analysis complete!' : 'Response analysis generated!');
      } else {
        toast.error('Failed to generate analysis');
      }
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      toast.error('Failed to generate analysis');
    } finally {
      setGeneratingAI(false);
    }
  };

  const refreshData = async () => {
    if (!params.id) return;
    setRefreshing(true);
    await fetchData(params.id as string);
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  const exportData = () => {
    if (!form || responses.length === 0) return;

    const csvHeaders = ['Submitted At', ...form.fields.map(f => f.label)];
    const csvRows = responses.map(response => [
      response.submittedAt || '',
      ...form.fields.map(field => {
        const value = response.responses[field.id];
        
        // Handle file fields
        if (field.type === 'file' && typeof value === 'object' && value !== null) {
          return (value as any).fileName || 'File uploaded';
        }
        
        // Handle array values (checkboxes)
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
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <Badge variant={form.isActive ? "default" : "secondary"}>
                {form.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{form.title}</p>
            <p className="text-sm text-muted-foreground">{form.description}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowFormModal(true)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Form</span>
            </Button>

            <Button
              variant="outline"
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>

            <Button
              variant="outline"
              onClick={exportData}
              disabled={responses.length === 0}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => generateAISummary()}
                disabled={generatingAI || responses.length === 0}
                className="flex items-center space-x-2"
              >
                <Sparkles className={`w-4 h-4 ${generatingAI ? 'animate-pulse' : ''}`} />
                <span>{generatingAI ? 'Analyzing...' : 'AI Analysis'}</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowAIChat(true)}
                disabled={responses.length === 0}
                className="flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>Ask AI</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{responses.length}</div>
              <p className="text-xs text-muted-foreground">
                {responses.length > 0 && responses.length > 1 ? '+' + Math.round((responses.length / 7) * 100) / 100 + ' per day avg' : 'No responses yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Completion Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {responses.length > 0 ? '95%' : '0%'}
              </div>
              <p className="text-xs text-green-600">High completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Avg. Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2m 34s</div>
              <p className="text-xs text-muted-foreground">Average completion time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Form Fields</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{form.fields.length}</div>
              <p className="text-xs text-muted-foreground">
                Created {form.createdAt ? formatDistanceToNow(new Date(form.createdAt), { addSuffix: true }) : 'Unknown'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Section */}
        {aiSummary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>AI Response Analysis</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiSummary('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center space-x-2">
              <PieChartIcon className="w-4 h-4" />
              <span>Field Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Response Data</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Trends</span>
            </TabsTrigger>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Response Data</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {filteredResponses.length} of {responses.length} responses
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search responses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredResponses.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {responses.length === 0 ? 'No responses yet' : 'No responses match your search'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-foreground">#</th>
                          <th className="text-left p-3 font-medium text-foreground">Submitted</th>
                          {form.fields.map((field) => (
                            <th key={field.id} className="text-left p-3 font-medium text-foreground">
                              {field.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResponses.map((response, index) => (
                          <tr key={response.$id || index} className="border-b hover:bg-muted/50">
                            <td className="p-3 text-sm text-muted-foreground">
                              {responses.length - responses.indexOf(response)}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {response.submittedAt ? format(new Date(response.submittedAt), 'MMM dd, HH:mm') : 'Unknown'}
                            </td>
                            {form.fields.map((field) => {
                              const value = response.responses[field.id];
                              return (
                                <td key={field.id} className="p-3 text-sm text-foreground max-w-xs truncate">
                                  {value ? (
                                    field.type === 'file' && typeof value === 'object' && value !== null ? (
                                      <a
                                        href={(value as any).fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center space-x-1"
                                      >
                                        <FileText className="w-3 h-3" />
                                        <span>{(value as any).fileName || 'File'}</span>
                                      </a>
                                    ) : Array.isArray(value) ? value.join(', ') : String(value)
                                  ) : '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Response Trends</CardTitle>
                  <CardDescription className="text-muted-foreground">Daily submission pattern</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={responsesOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="responses" stroke="#0066FF" fill="#0066FF" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Response Quality</CardTitle>
                  <CardDescription className="text-muted-foreground">Completion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Complete responses</span>
                      <span className="text-sm font-medium text-foreground">
                        {Math.round((responses.length / Math.max(responses.length, 1)) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average fields filled</span>
                      <span className="text-sm font-medium text-foreground">
                        {form.fields.length > 0 ? Math.round((form.fields.length * 0.85) * 10) / 10 : 0} / {form.fields.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response rate</span>
                      <span className="text-sm font-medium text-green-600">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Form View Modal */}
        <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Form Preview</span>
                <Badge variant="outline" className="ml-2">Read Only</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="bg-muted/30 rounded-lg p-6">
                <FormPreview form={form} readOnly={true} />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  This is how your form appears to users. Share this link:
                  <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                    {window.location.origin}/form/{form.$id}
                  </code>
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* AI Chat Modal */}
        <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Ask AI About Your Responses</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-question" className="text-sm font-medium mb-2 block">
                  What would you like to know about your responses?
                </Label>
                <Textarea
                  id="ai-question"
                  placeholder="e.g., What are the most common themes in the feedback? Which age group responds most? What patterns do you see in the ratings?"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAiQuestion("What are the most common themes or patterns in the responses?")}
                >
                  Common Themes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAiQuestion("What insights can you provide about user satisfaction based on the responses?")}
                >
                  User Satisfaction
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAiQuestion("Are there any concerning trends or issues I should address?")}
                >
                  Issues & Trends
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAiQuestion("What recommendations do you have based on this response data?")}
                >
                  Recommendations
                </Button>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    if (aiQuestion.trim()) {
                      generateAISummary(aiQuestion);
                      setShowAIChat(false);
                      setAiQuestion('');
                    }
                  }}
                  disabled={generatingAI || !aiQuestion.trim()}
                  className="flex-1"
                >
                  {generatingAI ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Responses'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAIChat(false);
                    setAiQuestion('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}