import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Target, TrendingUp, Calendar, Sparkles } from 'lucide-react';

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  motivation: number;
  confidence: number;
  notes?: string;
  aiInsights?: string[];
}

interface CareerMoodTrackerProps {
  onMoodUpdate?: (mood: MoodEntry) => void;
}

export default function CareerMoodTracker({ onMoodUpdate }: CareerMoodTrackerProps) {
  const [currentMood, setCurrentMood] = useState(7);
  const [currentEnergy, setCurrentEnergy] = useState(6);
  const [currentMotivation, setCurrentMotivation] = useState(8);
  const [currentConfidence, setCurrentConfidence] = useState(7);
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const moodEmojis = ['😫', '😕', '😐', '😊', '😄', '🚀', '⭐', '🔥', '💪', '🎯'];

  const mockMoodHistory: MoodEntry[] = [
    {
      id: '1',
      date: '2025-07-17',
      mood: 8,
      energy: 7,
      motivation: 9,
      confidence: 8,
      notes: 'Had a great interview today! Feeling confident about my job search.',
      aiInsights: ['High confidence correlates with interview preparation', 'Motivation peak detected - good time for applications']
    },
    {
      id: '2',
      date: '2025-07-16',
      mood: 6,
      energy: 5,
      motivation: 6,
      confidence: 5,
      notes: 'Feeling a bit overwhelmed with all the applications.',
      aiInsights: ['Consider breaking down tasks into smaller steps', 'Energy dip may indicate need for rest']
    },
    {
      id: '3',
      date: '2025-07-15',
      mood: 9,
      energy: 8,
      motivation: 9,
      confidence: 9,
      notes: 'Updated my resume and got positive feedback from a mentor.',
      aiInsights: ['Positive feedback significantly boosted all metrics', 'Peak performance state - ideal for networking']
    }
  ];

  useEffect(() => {
    setMoodHistory(mockMoodHistory);
  }, []);

  const generateAIInsights = async (mood: number, energy: number, motivation: number, confidence: number, notes: string) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/mood/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          energy,
          motivation,
          confidence,
          notes,
          previousEntries: moodHistory.slice(0, 3) // Send last 3 entries for trend analysis
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze mood');
      }

      const data = await response.json();
      const analysis = data.analysis;
      
      // Convert AI insights to simple strings for display
      const insightTexts = analysis.insights.map((insight: any) => insight.insight);
      const recommendations = analysis.recommendations || [];
      
      setAiInsights([
        `Emotional State: ${analysis.emotionalState}`,
        `Career Readiness: ${analysis.careerReadiness}/10`,
        `Trend: ${analysis.trend}`,
        ...insightTexts,
        ...recommendations.map((rec: string) => `💡 ${rec}`)
      ]);
      
    } catch (error) {
      console.error('Error getting AI insights:', error);
      // Fallback to basic insights
      const insights: string[] = [];
      
      if (mood >= 8) {
        insights.push('Your mood is excellent! This is a great time to tackle challenging tasks.');
      } else if (mood <= 4) {
        insights.push('Your mood seems low. Consider taking breaks and practicing self-care.');
      }
      
      if (energy >= 8) {
        insights.push('High energy levels detected. Perfect time for networking or skill development.');
      } else if (energy <= 4) {
        insights.push('Energy levels are low. Focus on easier tasks and plan rest periods.');
      }
      
      if (motivation >= 8) {
        insights.push('Your motivation is strong! Channel this into applications and skill building.');
      } else if (motivation <= 4) {
        insights.push('Motivation dip detected. Try setting smaller, achievable goals.');
      }
      
      if (confidence >= 8) {
        insights.push('High confidence levels! Great time for interviews and networking.');
      } else if (confidence <= 4) {
        insights.push('Consider practicing interview skills or reviewing your achievements.');
      }
      
      setAiInsights(insights);
    }
    
    setIsAnalyzing(false);
  };

  const saveMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      energy: currentEnergy,
      motivation: currentMotivation,
      confidence: currentConfidence,
      notes,
      aiInsights
    };
    
    setMoodHistory(prev => [newEntry, ...prev.slice(0, 6)]);
    onMoodUpdate?.(newEntry);
    
    // Reset form
    setNotes('');
    setAiInsights([]);
  };

  const getAverageScore = () => {
    return Math.round((currentMood + currentEnergy + currentMotivation + currentConfidence) / 4);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'stable';
    const current = getAverageScore();
    const previous = Math.round((moodHistory[0].mood + moodHistory[0].energy + moodHistory[0].motivation + moodHistory[0].confidence) / 4);
    if (current > previous) return 'improving';
    if (current < previous) return 'declining';
    return 'stable';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Personalized Career Mood Tracker
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Mood Input */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-2">{moodEmojis[Math.min(Math.floor(currentMood), 9)]}</div>
            <p className="text-sm text-muted-foreground">How are you feeling today?</p>
          </div>
          
          {/* Mood Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Mood</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-8">{currentMood}/10</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Energy</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEnergy}
                  onChange={(e) => setCurrentEnergy(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-8">{currentEnergy}/10</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Motivation</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMotivation}
                  onChange={(e) => setCurrentMotivation(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-8">{currentMotivation}/10</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Confidence</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentConfidence}
                  onChange={(e) => setCurrentConfidence(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-8">{currentConfidence}/10</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              placeholder="How was your day? Any job search updates, interviews, or feelings you'd like to track?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => generateAIInsights(currentMood, currentEnergy, currentMotivation, currentConfidence, notes)}
              disabled={isAnalyzing}
              variant="outline"
              className="flex-1"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Get AI Insights'}
            </Button>
            <Button onClick={saveMoodEntry} className="flex-1">
              Save Entry
            </Button>
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI-Powered Career Insights
            </h3>
            <ul className="space-y-1">
              {aiInsights.map((insight, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <Sparkles className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mood Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{getAverageScore()}/10</div>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className={`h-4 w-4 ${getMoodTrend() === 'improving' ? 'text-green-500' : getMoodTrend() === 'declining' ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className="font-semibold capitalize">{getMoodTrend()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Trend</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{moodHistory.length}</div>
            <p className="text-sm text-muted-foreground">Entries Tracked</p>
          </div>
        </div>

        {/* Recent History */}
        {moodHistory.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Mood History
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {moodHistory.slice(0, 3).map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{entry.date}</span>
                    <Badge variant="secondary">
                      {Math.round((entry.mood + entry.energy + entry.motivation + entry.confidence) / 4)}/10
                    </Badge>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground mb-2">{entry.notes}</p>
                  )}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>Mood: {entry.mood}</div>
                    <div>Energy: {entry.energy}</div>
                    <div>Motivation: {entry.motivation}</div>
                    <div>Confidence: {entry.confidence}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}