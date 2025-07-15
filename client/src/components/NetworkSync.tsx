import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Linkedin, 
  Github, 
  Twitter, 
  Mail, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Filter,
  Search,
  Plus,
  Link,
  UserPlus,
  Settings,
  Globe,
  Building,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface NetworkConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  platform: string;
  profileUrl: string;
  avatarUrl?: string;
  connectionType: 'first' | 'second' | 'third';
  connectionDate: string;
  lastInteraction?: string;
  industry: string;
  skills: string[];
  mutualConnections: number;
  status: 'connected' | 'pending' | 'not_connected';
  notes?: string;
  tags: string[];
  isKeyContact: boolean;
}

interface PlatformConnection {
  platform: string;
  isConnected: boolean;
  connectionCount: number;
  lastSync: string;
  syncStatus: 'success' | 'pending' | 'error';
}

const platforms = [
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: 'bg-blue-600', 
    textColor: 'text-blue-600',
    description: 'Professional networking platform'
  },
  { 
    name: 'GitHub', 
    icon: Github, 
    color: 'bg-gray-800', 
    textColor: 'text-gray-800',
    description: 'Developer networking and code collaboration'
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    color: 'bg-blue-400', 
    textColor: 'text-blue-400',
    description: 'Professional conversations and industry updates'
  },
  { 
    name: 'AngelList', 
    icon: Building, 
    color: 'bg-black', 
    textColor: 'text-black',
    description: 'Startup and venture capital networking'
  }
];

const connectionTypes = [
  { value: 'first', label: '1st Degree', color: 'bg-green-100 text-green-800' },
  { value: 'second', label: '2nd Degree', color: 'bg-blue-100 text-blue-800' },
  { value: 'third', label: '3rd Degree', color: 'bg-gray-100 text-gray-800' }
];

const industries = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Sales', 'Consulting', 'Manufacturing', 'Retail', 'Media',
  'Non-profit', 'Government', 'Real Estate', 'Legal', 'Other'
];

const sampleConnections: NetworkConnection[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    platform: 'LinkedIn',
    profileUrl: 'https://linkedin.com/in/sarahjohnson',
    avatarUrl: '',
    connectionType: 'first',
    connectionDate: '2024-01-15',
    lastInteraction: '2024-01-20',
    industry: 'Technology',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    mutualConnections: 15,
    status: 'connected',
    notes: 'Met at tech conference. Very knowledgeable about system design.',
    tags: ['frontend', 'mentor', 'tech-lead'],
    isKeyContact: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Seattle, WA',
    platform: 'LinkedIn',
    profileUrl: 'https://linkedin.com/in/michaelchen',
    connectionType: 'second',
    connectionDate: '2024-02-10',
    industry: 'Technology',
    skills: ['Product Strategy', 'Agile', 'Data Analysis'],
    mutualConnections: 8,
    status: 'connected',
    tags: ['product-management', 'agile'],
    isKeyContact: false
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Angeles, CA',
    platform: 'GitHub',
    profileUrl: 'https://github.com/emilyrodriguez',
    connectionType: 'first',
    connectionDate: '2024-03-05',
    industry: 'Technology',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    mutualConnections: 12,
    status: 'connected',
    notes: 'Collaborated on open source project. Great DevOps insights.',
    tags: ['devops', 'kubernetes', 'opensource'],
    isKeyContact: true
  }
];

export default function NetworkSync() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [connections, setConnections] = useState<NetworkConnection[]>(sampleConnections);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedConnection, setSelectedConnection] = useState<NetworkConnection | null>(null);
  const [showAddConnectionDialog, setShowAddConnectionDialog] = useState(false);
  const [newConnection, setNewConnection] = useState<Partial<NetworkConnection>>({});
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncFrequency: 'daily',
    notifyOnNewConnections: true,
    prioritizeKeyContacts: true
  });

  const { data: networkConnections, isLoading } = useQuery({
    queryKey: ['/api/network-connections'],
    staleTime: 300000,
  });

  const syncMutation = useMutation({
    mutationFn: async (platform: string) => {
      return await apiRequest(`/api/network-connections/sync/${platform}`, 'POST', {});
    },
    onSuccess: (data, platform) => {
      toast({
        title: "Sync Successful",
        description: `Successfully synced ${data.length} connections from ${platform}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/network-connections'] });
    },
    onError: (error, platform) => {
      toast({
        title: "Sync Failed",
        description: `Failed to sync connections from ${platform}. Please check your connection.`,
        variant: "destructive",
      });
    }
  });

  const addConnectionMutation = useMutation({
    mutationFn: async (connectionData: any) => {
      return await apiRequest('/api/network-connections', 'POST', connectionData);
    },
    onSuccess: () => {
      toast({
        title: "Connection Added",
        description: "New connection has been added to your network.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/network-connections'] });
      setShowAddConnectionDialog(false);
      setNewConnection({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add connection. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conn.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conn.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || conn.platform === selectedPlatform;
    const matchesIndustry = selectedIndustry === 'all' || conn.industry === selectedIndustry;
    
    return matchesSearch && matchesPlatform && matchesIndustry;
  });

  const platformStats = platforms.map(platform => ({
    ...platform,
    connectionCount: connections.filter(c => c.platform === platform.name).length,
    lastSync: '2024-01-20',
    syncStatus: 'success' as const
  }));

  const handleSync = (platform: string) => {
    toast({
      title: "Sync Started",
      description: `Starting sync with ${platform}...`,
    });
    // In a real implementation, this would trigger OAuth flow
    syncMutation.mutate(platform);
  };

  const handleAddConnection = () => {
    if (!newConnection.name || !newConnection.platform) return;

    const connectionData = {
      ...newConnection,
      connectionDate: new Date().toISOString(),
      status: 'connected',
      connectionType: newConnection.connectionType || 'first',
      mutualConnections: 0,
      skills: newConnection.skills || [],
      tags: newConnection.tags || [],
      isKeyContact: newConnection.isKeyContact || false
    };

    addConnectionMutation.mutate(connectionData);
  };

  const ConnectionCard = ({ connection }: { connection: NetworkConnection }) => {
    const platformData = platforms.find(p => p.name === connection.platform);
    const connectionTypeData = connectionTypes.find(t => t.value === connection.connectionType);
    
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedConnection(connection)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={connection.avatarUrl} alt={connection.name} />
              <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {connection.name}
                    {connection.isKeyContact && (
                      <Star className="inline h-3 w-3 ml-1 text-yellow-500 fill-current" />
                    )}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">{connection.title}</p>
                  <p className="text-xs text-gray-500 truncate">{connection.company}</p>
                </div>
                <div className="flex items-center gap-1">
                  {platformData && (
                    <div className={`${platformData.color} p-1 rounded text-white`}>
                      <platformData.icon className="h-3 w-3" />
                    </div>
                  )}
                  {connectionTypeData && (
                    <Badge variant="secondary" className={`text-xs ${connectionTypeData.color}`}>
                      {connectionTypeData.label}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{connection.location}</span>
                <span>•</span>
                <span>{connection.mutualConnections} mutual</span>
              </div>
              
              {connection.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {connection.skills.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {connection.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{connection.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PlatformCard = ({ platform }: { platform: typeof platformStats[0] }) => {
    const Icon = platform.icon;
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`${platform.color} p-2 rounded-lg text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{platform.name}</h3>
                <p className="text-xs text-gray-600">{platform.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {platform.syncStatus === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections</span>
              <span className="font-medium">{platform.connectionCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Sync</span>
              <span className="text-gray-500">{new Date(platform.lastSync).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Button 
            onClick={() => handleSync(platform.name)}
            size="sm" 
            className="w-full"
            disabled={syncMutation.isPending}
          >
            <Link className="h-4 w-4 mr-2" />
            {syncMutation.isPending ? 'Syncing...' : 'Sync Now'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Professional Network Sync
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage and sync your professional connections across all platforms
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showAddConnectionDialog} onOpenChange={setShowAddConnectionDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Connection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Connection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newConnection.name || ''}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={newConnection.title || ''}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newConnection.company || ''}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Google"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={newConnection.platform || ''}
                      onValueChange={(value) => setNewConnection(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map(platform => (
                          <SelectItem key={platform.name} value={platform.name}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="profileUrl">Profile URL</Label>
                    <Input
                      id="profileUrl"
                      value={newConnection.profileUrl || ''}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, profileUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="keyContact"
                      checked={newConnection.isKeyContact || false}
                      onCheckedChange={(checked) => setNewConnection(prev => ({ ...prev, isKeyContact: checked }))}
                    />
                    <Label htmlFor="keyContact">Mark as key contact</Label>
                  </div>
                  <Button onClick={handleAddConnection} className="w-full">
                    Add Connection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="search"
                          placeholder="Search connections..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          {platforms.map(platform => (
                            <SelectItem key={platform.name} value={platform.name}>
                              {platform.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Connections List */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Your Connections ({filteredConnections.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {connections.filter(c => c.isKeyContact).length} Key Contacts
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredConnections.map(connection => (
                    <ConnectionCard key={connection.id} connection={connection} />
                  ))}
                </div>
                
                {filteredConnections.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No connections found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or sync your platforms</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="platforms" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformStats.map(platform => (
                <PlatformCard key={platform.name} platform={platform} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Connections</p>
                      <p className="text-2xl font-bold">{connections.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Key Contacts</p>
                      <p className="text-2xl font-bold">{connections.filter(c => c.isKeyContact).length}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Platforms</p>
                      <p className="text-2xl font-bold">{platforms.length}</p>
                    </div>
                    <Globe className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Industry Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {industries.slice(0, 5).map(industry => {
                      const count = connections.filter(c => c.industry === industry).length;
                      const percentage = (count / connections.length) * 100;
                      return (
                        <div key={industry}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{industry}</span>
                            <span>{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {platforms.map(platform => {
                      const count = connections.filter(c => c.platform === platform.name).length;
                      const percentage = (count / connections.length) * 100;
                      return (
                        <div key={platform.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{platform.name}</span>
                            <span>{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}