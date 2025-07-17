import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Download, Mail, Search, Users, TrendingUp, Calendar } from 'lucide-react';

interface WaitingListEntry {
  id: number;
  email: string;
  source?: string;
  createdAt: string;
  notified: boolean;
}

interface WaitingListData {
  entries: WaitingListEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalCount: number;
    recentSignups: number;
    todaySignups: number;
  };
}

export default function AdminWaitingList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<WaitingListData>({
    queryKey: ['/api/admin/waiting-list', currentPage, searchTerm],
    queryFn: async () => {
      const response = await fetch(`/api/admin/waiting-list?page=${currentPage}&limit=50&search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch waiting list');
      }
      return response.json();
    },
    retry: false,
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/waiting-list/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to export waiting list');
      }
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waiting-list-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Export successful',
        description: 'Waiting list has been exported to CSV',
      });
    },
    onError: () => {
      toast({
        title: 'Export failed',
        description: 'Failed to export waiting list',
        variant: 'destructive',
      });
    },
  });

  const notifyMutation = useMutation({
    mutationFn: async ({ subject, message, testMode }: { subject: string; message: string; testMode: boolean }) => {
      const response = await fetch('/api/admin/waiting-list/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message, testMode }),
      });
      if (!response.ok) {
        throw new Error('Failed to send notifications');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Notifications sent',
        description: `${data.message}. Sent: ${data.stats.sent}, Failed: ${data.stats.failed}`,
      });
      setIsDialogOpen(false);
      setEmailSubject('');
      setEmailMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/waiting-list'] });
    },
    onError: () => {
      toast({
        title: 'Notification failed',
        description: 'Failed to send notifications',
        variant: 'destructive',
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSendEmail = (testMode: boolean) => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast({
        title: 'Invalid input',
        description: 'Please provide both subject and message',
        variant: 'destructive',
      });
      return;
    }

    notifyMutation.mutate({
      subject: emailSubject,
      message: emailMessage,
      testMode,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access the admin panel. Please contact an administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Waiting List Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your SmartJobFit waiting list subscribers
          </p>
        </div>

        {/* Stats Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.stats.totalCount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <TrendingUp className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Signups (24h)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.stats.recentSignups}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Signups</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.stats.todaySignups}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="subscribers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="notifications">Send Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button type="submit" variant="outline">
                      Search
                    </Button>
                  </form>
                  <Button
                    onClick={() => exportMutation.mutate()}
                    disabled={exportMutation.isPending}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : data?.entries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No subscribers found
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {entry.source || 'homepage'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={entry.notified ? 'default' : 'outline'}>
                                {entry.notified ? 'Notified' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {data && data.pagination.pages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <Button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                        >
                          Previous
                        </Button>
                        <span className="py-2 px-4 text-sm text-gray-600">
                          Page {currentPage} of {data.pagination.pages}
                        </span>
                        <Button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === data.pagination.pages}
                          variant="outline"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Send Notifications</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send updates or announcements to your waiting list subscribers
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="SmartJobFit Update - We're Almost Ready!"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Dear SmartJobFit early adopter,&#10;&#10;We're excited to share that we're getting closer to launch! Here's what's new..."
                    rows={8}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSendEmail(true)}
                    disabled={notifyMutation.isPending}
                    variant="outline"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Test (5 emails)
                  </Button>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={notifyMutation.isPending}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send to All Subscribers
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Mass Email</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Are you sure you want to send this email to all {data?.stats.totalCount} subscribers?
                        This action cannot be undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSendEmail(false)}
                          disabled={notifyMutation.isPending}
                        >
                          {notifyMutation.isPending ? 'Sending...' : 'Send Email'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}