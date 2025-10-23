'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Database, Loader2 } from 'lucide-react';

export default function SeedDataPage() {
  const [userId, setUserId] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSeedData = async () => {
    if (!userId.trim()) {
      toast.error('Please enter your User ID');
      return;
    }

    setSeeding(true);
    setResults(null);

    try {
      const response = await fetch('/api/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        toast.success('Data seeded successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to seed data');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed data');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Seed Sample Data</h1>
          <p className="text-muted-foreground">
            Generate sample forms and responses for testing analytics and AI features
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Data Seeding</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="userId" className="text-sm font-medium mb-2 block">
                Your User ID
              </Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your Appwrite User ID"
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                You can find your User ID in the Appwrite console under Auth → Users, or check localStorage in browser dev tools
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">What will be created:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 3 sample forms with different field types</li>
                <li>• 15-35 realistic responses per form</li>
                <li>• Responses spread over the last 30 days</li>
                <li>• Realistic names, emails, and feedback</li>
                <li>• Perfect for testing analytics and AI features</li>
              </ul>
            </div>

            <Button
              onClick={handleSeedData}
              disabled={seeding || !userId.trim()}
              className="w-full"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding Data...
                </>
              ) : (
                'Seed Sample Data'
              )}
            </Button>

            {results && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">✅ Success!</h3>
                <p className="text-sm text-green-700 mb-3">{results.message}</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-800">Created Forms:</p>
                  {results.forms?.map((form: any) => (
                    <p key={form.id} className="text-xs text-green-600">
                      • {form.title} (ID: {form.id})
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                After seeding, go to your dashboard to see the new forms and test the analytics features!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}