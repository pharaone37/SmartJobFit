import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Image, Target, Lightbulb, Trash2, Edit, Save, Share2, Download } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MoodBoardItem {
  id: string;
  type: 'image' | 'text' | 'quote' | 'goal' | 'inspiration';
  content: string;
  position: { x: number; y: number };
  style: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    borderRadius?: number;
    padding?: number;
  };
  metadata?: {
    author?: string;
    source?: string;
    tags?: string[];
  };
}

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  category: 'career' | 'skill' | 'personal' | 'financial';
  progress: number;
  milestones: string[];
}

interface MoodBoard {
  id: string;
  title: string;
  description: string;
  items: MoodBoardItem[];
  goals: CareerGoal[];
  inspiration: any[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

const inspirationCategories = [
  'Career Success Stories',
  'Industry Leaders',
  'Motivational Quotes',
  'Company Culture',
  'Work-Life Balance',
  'Skill Development',
  'Innovation & Tech',
  'Leadership',
  'Entrepreneurship',
  'Personal Growth'
];

const goalCategories = [
  { value: 'career', label: 'Career Advancement', icon: '🚀' },
  { value: 'skill', label: 'Skill Development', icon: '📚' },
  { value: 'personal', label: 'Personal Growth', icon: '🌱' },
  { value: 'financial', label: 'Financial Goals', icon: '💰' }
];

export default function CareerMoodBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBoard, setSelectedBoard] = useState<MoodBoard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState<MoodBoardItem | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<CareerGoal>>({});
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: moodBoards, isLoading } = useQuery({
    queryKey: ['/api/mood-boards'],
    staleTime: 300000,
  });

  const createMoodBoardMutation = useMutation({
    mutationFn: async (boardData: any) => {
      return await apiRequest('/api/mood-boards', 'POST', boardData);
    },
    onSuccess: () => {
      toast({
        title: "Mood Board Created",
        description: "Your career mood board has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mood-boards'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create mood board. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateMoodBoardMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      return await apiRequest(`/api/mood-boards/${id}`, 'PUT', updates);
    },
    onSuccess: () => {
      toast({
        title: "Mood Board Updated",
        description: "Your changes have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mood-boards'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update mood board. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateBoard = () => {
    createMoodBoardMutation.mutate({
      title: "My Career Vision",
      description: "Visualizing my career aspirations and goals",
      items: [],
      goals: [],
      inspiration: [],
      isPrivate: true
    });
  };

  const handleAddItem = (type: MoodBoardItem['type'], content: string) => {
    if (!selectedBoard) return;

    const newItem: MoodBoardItem = {
      id: Date.now().toString(),
      type,
      content,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      style: {
        backgroundColor: type === 'quote' ? '#f8fafc' : '#ffffff',
        textColor: '#1f2937',
        fontSize: type === 'quote' ? 16 : 14,
        borderRadius: 8,
        padding: 16
      },
      metadata: {
        tags: []
      }
    };

    const updatedBoard = {
      ...selectedBoard,
      items: [...selectedBoard.items, newItem]
    };

    setSelectedBoard(updatedBoard);
    updateMoodBoardMutation.mutate({ id: selectedBoard.id, items: updatedBoard.items });
  };

  const handleAddGoal = () => {
    if (!selectedBoard || !newGoal.title) return;

    const goal: CareerGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || '',
      timeframe: newGoal.timeframe || '6 months',
      priority: newGoal.priority || 'medium',
      category: newGoal.category || 'career',
      progress: 0,
      milestones: []
    };

    const updatedBoard = {
      ...selectedBoard,
      goals: [...selectedBoard.goals, goal]
    };

    setSelectedBoard(updatedBoard);
    updateMoodBoardMutation.mutate({ id: selectedBoard.id, goals: updatedBoard.goals });
    setNewGoal({});
    setShowGoalDialog(false);
  };

  const handleUpdateItemPosition = (itemId: string, newPosition: { x: number; y: number }) => {
    if (!selectedBoard) return;

    const updatedItems = selectedBoard.items.map(item =>
      item.id === itemId ? { ...item, position: newPosition } : item
    );

    const updatedBoard = { ...selectedBoard, items: updatedItems };
    setSelectedBoard(updatedBoard);
    updateMoodBoardMutation.mutate({ id: selectedBoard.id, items: updatedItems });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedBoard) return;

    const updatedItems = selectedBoard.items.filter(item => item.id !== itemId);
    const updatedBoard = { ...selectedBoard, items: updatedItems };
    setSelectedBoard(updatedBoard);
    updateMoodBoardMutation.mutate({ id: selectedBoard.id, items: updatedItems });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleAddItem('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const MoodBoardCanvas = ({ board }: { board: MoodBoard }) => (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
      {board.items.map((item) => (
        <div
          key={item.id}
          className="absolute cursor-move hover:shadow-lg transition-shadow"
          style={{
            left: `${item.position.x}px`,
            top: `${item.position.y}px`,
            backgroundColor: item.style.backgroundColor,
            color: item.style.textColor,
            fontSize: `${item.style.fontSize}px`,
            borderRadius: `${item.style.borderRadius}px`,
            padding: `${item.style.padding}px`,
            maxWidth: '200px',
            zIndex: 10
          }}
          draggable={isEditing}
          onDragStart={() => setDraggedItem(item)}
          onDragEnd={(e) => {
            if (draggedItem) {
              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
              if (rect) {
                const newX = e.clientX - rect.left;
                const newY = e.clientY - rect.top;
                handleUpdateItemPosition(draggedItem.id, { x: newX, y: newY });
              }
            }
            setDraggedItem(null);
          }}
        >
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="Mood board item"
              className="w-full h-auto max-w-32 max-h-32 object-cover rounded"
            />
          ) : (
            <div className="text-sm">
              {item.type === 'quote' && <span className="text-lg">&ldquo;</span>}
              {item.content}
              {item.type === 'quote' && <span className="text-lg">&rdquo;</span>}
            </div>
          )}
          {isEditing && (
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 p-0"
              onClick={() => handleDeleteItem(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
      {board.items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Start building your career vision</p>
            <p className="text-sm">Add images, quotes, and goals to inspire your journey</p>
          </div>
        </div>
      )}
    </div>
  );

  const GoalCard = ({ goal }: { goal: CareerGoal }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm">{goal.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{goal.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
              {goal.priority}
            </Badge>
            <span className="text-xs text-gray-500">{goal.timeframe}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">
            {goalCategories.find(cat => cat.value === goal.category)?.icon}
          </span>
          <span className="text-xs text-gray-600">
            {goalCategories.find(cat => cat.value === goal.category)?.label}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{goal.progress}% complete</p>
      </CardContent>
    </Card>
  );

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
              Career Mood Board
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Visualize your career aspirations and create a personalized roadmap
            </p>
          </div>
          <div className="flex gap-2">
            {!moodBoards?.length ? (
              <Button onClick={handleCreateBoard} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Mood Board
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? 'Done' : 'Edit'}
                </Button>
                <Button variant="secondary" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </>
            )}
          </div>
        </div>

        {moodBoards?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mood Board Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Mood Boards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {moodBoards.map((board: MoodBoard) => (
                      <Button
                        key={board.id}
                        variant={selectedBoard?.id === board.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedBoard(board)}
                      >
                        {board.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Content Panel */}
              {selectedBoard && isEditing && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image className="h-4 w-4" />
                      Add Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                          <Plus className="h-4 w-4" />
                          Add Quote
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Inspirational Quote</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Enter an inspirational quote..."
                            id="quote-input"
                          />
                          <Button
                            onClick={() => {
                              const input = document.getElementById('quote-input') as HTMLTextAreaElement;
                              if (input.value) {
                                handleAddItem('quote', input.value);
                                input.value = '';
                              }
                            }}
                          >
                            Add Quote
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                          <Target className="h-4 w-4" />
                          Add Goal
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Career Goal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="goal-title">Goal Title</Label>
                            <Input
                              id="goal-title"
                              value={newGoal.title || ''}
                              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Become a Senior Developer"
                            />
                          </div>
                          <div>
                            <Label htmlFor="goal-description">Description</Label>
                            <Textarea
                              id="goal-description"
                              value={newGoal.description || ''}
                              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Describe your goal in detail..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="goal-category">Category</Label>
                            <Select
                              value={newGoal.category || 'career'}
                              onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value as any }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {goalCategories.map(cat => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    {cat.icon} {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="goal-timeframe">Timeframe</Label>
                            <Select
                              value={newGoal.timeframe || '6 months'}
                              onValueChange={(value) => setNewGoal(prev => ({ ...prev, timeframe: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1 month">1 Month</SelectItem>
                                <SelectItem value="3 months">3 Months</SelectItem>
                                <SelectItem value="6 months">6 Months</SelectItem>
                                <SelectItem value="1 year">1 Year</SelectItem>
                                <SelectItem value="2+ years">2+ Years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="goal-priority">Priority</Label>
                            <Select
                              value={newGoal.priority || 'medium'}
                              onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value as any }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddGoal} className="w-full">
                            Add Goal
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedBoard ? (
                <Tabs defaultValue="board" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="board">Mood Board</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                    <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="board" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedBoard.title}</CardTitle>
                        <p className="text-sm text-gray-600">{selectedBoard.description}</p>
                      </CardHeader>
                      <CardContent>
                        <MoodBoardCanvas board={selectedBoard} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="goals" className="mt-4">
                    <div className="space-y-4">
                      {selectedBoard.goals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                      ))}
                      {selectedBoard.goals.length === 0 && (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">No goals added yet</p>
                            <p className="text-sm text-gray-400">Add your first career goal to get started</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inspiration" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Inspiration Collection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {inspirationCategories.map((category) => (
                            <Button
                              key={category}
                              variant="outline"
                              className="h-auto p-4 text-left"
                              onClick={() => {
                                toast({
                                  title: "Feature Coming Soon",
                                  description: `${category} inspiration will be available soon!`,
                                });
                              }}
                            >
                              <div>
                                <div className="font-medium text-sm">{category}</div>
                                <div className="text-xs text-gray-500 mt-1">Explore ideas</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Select a mood board to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-semibold mb-4">Create Your Career Vision</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Start building your personalized career mood board. Add inspiring images, motivational quotes, 
                and set ambitious goals to visualize your professional journey.
              </p>
              <Button onClick={handleCreateBoard} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Mood Board
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}