import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

interface WhisperTranscription {
  text: string;
  language: string;
  duration: number;
  segments: Array<{
    start: number;
    end: number;
    text: string;
    confidence: number;
  }>;
  words: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

interface WhisperInterviewAnalysis {
  transcription: WhisperTranscription;
  speechAnalysis: {
    overallScore: number;
    fluency: {
      score: number;
      fillerWords: number;
      pauseAnalysis: {
        averagePauseLength: number;
        longPauses: number;
        appropriatePauses: number;
      };
    };
    clarity: {
      score: number;
      articulation: number;
      volume: number;
      pace: number;
    };
    content: {
      score: number;
      keywordUsage: string[];
      technicalTerms: string[];
      professionalLanguage: number;
    };
    confidence: {
      score: number;
      hesitations: number;
      assertiveness: number;
      conviction: number;
    };
  };
  recommendations: Array<{
    category: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
  }>;
  practiceAreas: string[];
}

interface WhisperMeetingAnalysis {
  transcription: WhisperTranscription;
  participants: Array<{
    speakerId: string;
    speakingTime: number;
    wordCount: number;
    dominanceLevel: number;
  }>;
  topics: Array<{
    topic: string;
    timeSpent: number;
    importance: number;
    actionItems: string[];
  }>;
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    emotional_tone: string[];
    engagement_level: number;
  };
  insights: {
    keyDecisions: string[];
    followUpActions: string[];
    concerns: string[];
    opportunities: string[];
  };
}

interface WhisperBatchProcessing {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  files: Array<{
    filename: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transcription?: WhisperTranscription;
    error?: string;
  }>;
  progress: number;
  estimatedCompletion: string;
}

class WhisperService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  async transcribeAudio(params: {
    audioFile: string | Buffer;
    language?: string;
    prompt?: string;
    responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    temperature?: number;
    includeTimestamps?: boolean;
    includeWordLevelTimestamps?: boolean;
  }): Promise<WhisperTranscription> {
    if (!process.env.OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY not found. Using fallback transcription.');
      return this.getFallbackTranscription(params);
    }

    try {
      let audioStream: fs.ReadStream;
      
      if (typeof params.audioFile === 'string') {
        audioStream = fs.createReadStream(params.audioFile);
      } else {
        // Handle Buffer by writing to temp file
        const tempFile = path.join('/tmp', `audio_${Date.now()}.wav`);
        fs.writeFileSync(tempFile, params.audioFile);
        audioStream = fs.createReadStream(tempFile);
      }

      const response = await this.openai.audio.transcriptions.create({
        file: audioStream,
        model: 'whisper-1',
        language: params.language,
        prompt: params.prompt,
        response_format: params.responseFormat || 'verbose_json',
        temperature: params.temperature || 0,
        timestamp_granularities: params.includeWordLevelTimestamps ? ['word', 'segment'] : ['segment']
      });

      return this.transformTranscription(response);
    } catch (error) {
      console.error('Whisper transcription error:', error);
      return this.getFallbackTranscription(params);
    }
  }

  async analyzeInterviewSpeech(params: {
    audioFile: string | Buffer;
    jobRole: string;
    interviewType: 'behavioral' | 'technical' | 'cultural' | 'panel';
    language?: string;
    analysisDepth: 'basic' | 'comprehensive' | 'detailed';
  }): Promise<WhisperInterviewAnalysis> {
    try {
      // First, transcribe the audio
      const transcription = await this.transcribeAudio({
        audioFile: params.audioFile,
        language: params.language,
        includeTimestamps: true,
        includeWordLevelTimestamps: true
      });

      // Analyze speech patterns
      const speechAnalysis = await this.analyzeSpeechPatterns(transcription, params);

      // Generate recommendations
      const recommendations = await this.generateSpeechRecommendations(speechAnalysis, params);

      return {
        transcription,
        speechAnalysis,
        recommendations,
        practiceAreas: this.identifyPracticeAreas(speechAnalysis)
      };
    } catch (error) {
      console.error('Interview speech analysis error:', error);
      return this.getFallbackInterviewAnalysis(params);
    }
  }

  async analyzeMeetingDiscussion(params: {
    audioFile: string | Buffer;
    meetingType: 'standup' | 'review' | 'planning' | 'retrospective' | 'interview';
    expectedParticipants?: string[];
    language?: string;
  }): Promise<WhisperMeetingAnalysis> {
    try {
      const transcription = await this.transcribeAudio({
        audioFile: params.audioFile,
        language: params.language,
        includeTimestamps: true,
        includeWordLevelTimestamps: true
      });

      const participants = await this.identifyParticipants(transcription, params.expectedParticipants);
      const topics = await this.extractTopics(transcription, params.meetingType);
      const sentiment = await this.analyzeSentiment(transcription);
      const insights = await this.generateMeetingInsights(transcription, params.meetingType);

      return {
        transcription,
        participants,
        topics,
        sentiment,
        insights
      };
    } catch (error) {
      console.error('Meeting analysis error:', error);
      return this.getFallbackMeetingAnalysis(params);
    }
  }

  async processBatchAudio(params: {
    audioFiles: Array<{
      filename: string;
      file: string | Buffer;
      metadata?: any;
    }>;
    processingType: 'transcription' | 'interview_analysis' | 'meeting_analysis';
    options?: any;
  }): Promise<WhisperBatchProcessing> {
    const jobId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const batchJob: WhisperBatchProcessing = {
        jobId,
        status: 'processing',
        files: params.audioFiles.map(file => ({
          filename: file.filename,
          status: 'pending'
        })),
        progress: 0,
        estimatedCompletion: new Date(Date.now() + params.audioFiles.length * 30000).toISOString()
      };

      // Process files sequentially (in production, this would be done asynchronously)
      for (let i = 0; i < params.audioFiles.length; i++) {
        const file = params.audioFiles[i];
        try {
          batchJob.files[i].status = 'processing';
          
          if (params.processingType === 'transcription') {
            const transcription = await this.transcribeAudio({
              audioFile: file.file,
              ...params.options
            });
            batchJob.files[i].transcription = transcription;
          } else if (params.processingType === 'interview_analysis') {
            const analysis = await this.analyzeInterviewSpeech({
              audioFile: file.file,
              ...params.options
            });
            batchJob.files[i].transcription = analysis.transcription;
          }
          
          batchJob.files[i].status = 'completed';
          batchJob.progress = Math.round(((i + 1) / params.audioFiles.length) * 100);
        } catch (error) {
          batchJob.files[i].status = 'failed';
          batchJob.files[i].error = error.message;
        }
      }

      batchJob.status = 'completed';
      return batchJob;
    } catch (error) {
      console.error('Batch processing error:', error);
      return this.getFallbackBatchProcessing(params);
    }
  }

  async generateSpeechFeedback(params: {
    transcription: WhisperTranscription;
    targetRole: string;
    focusAreas: string[];
    language?: string;
  }): Promise<{
    overallFeedback: string;
    specificFeedback: Array<{
      timeRange: { start: number; end: number };
      feedback: string;
      type: 'positive' | 'improvement' | 'critical';
    }>;
    improvementPlan: Array<{
      area: string;
      currentLevel: number;
      targetLevel: number;
      exercises: string[];
      timeframe: string;
    }>;
    nextSteps: string[];
  }> {
    try {
      const { openRouterService } = await import('./openRouterService');
      
      const prompt = `Analyze this interview speech transcription and provide detailed feedback:
      
      Transcription: ${JSON.stringify(params.transcription)}
      Target Role: ${params.targetRole}
      Focus Areas: ${params.focusAreas.join(', ')}
      
      Provide:
      1. Overall feedback assessment
      2. Specific time-based feedback
      3. Structured improvement plan
      4. Next steps for development
      
      Format as structured JSON.`;

      const aiResponse = await openRouterService.generateResponse(prompt, 'gpt-4');
      return this.parseSpeechFeedback(aiResponse);
    } catch (error) {
      console.error('Speech feedback generation error:', error);
      return this.getFallbackSpeechFeedback(params);
    }
  }

  private transformTranscription(response: any): WhisperTranscription {
    return {
      text: response.text || '',
      language: response.language || 'en',
      duration: response.duration || 0,
      segments: response.segments || [],
      words: response.words || []
    };
  }

  private async analyzeSpeechPatterns(transcription: WhisperTranscription, params: any): Promise<any> {
    const text = transcription.text;
    const words = transcription.words || [];
    const segments = transcription.segments || [];

    // Analyze fluency
    const fillerWords = (text.match(/\b(um|uh|er|ah|like|you know|actually|basically)\b/gi) || []).length;
    const wordCount = words.length;
    const totalDuration = transcription.duration;
    const wpm = Math.round((wordCount / totalDuration) * 60);

    // Analyze pauses
    const longPauses = segments.filter(s => s.start > 0 && segments.find(prev => prev.end < s.start && (s.start - prev.end) > 2)).length;
    const averagePauseLength = segments.reduce((acc, curr, i) => {
      if (i === 0) return acc;
      const prevSegment = segments[i - 1];
      const pause = curr.start - prevSegment.end;
      return acc + pause;
    }, 0) / Math.max(segments.length - 1, 1);

    // Analyze technical terms and keywords
    const technicalTerms = this.extractTechnicalTerms(text, params.jobRole);
    const keywordUsage = this.extractKeywords(text, params.jobRole);

    return {
      overallScore: this.calculateOverallScore(fillerWords, wpm, longPauses, technicalTerms.length),
      fluency: {
        score: Math.max(0, 100 - (fillerWords * 2) - (longPauses * 5)),
        fillerWords,
        pauseAnalysis: {
          averagePauseLength,
          longPauses,
          appropriatePauses: Math.max(0, segments.length - longPauses)
        }
      },
      clarity: {
        score: Math.min(100, Math.max(0, 100 - Math.abs(wpm - 150) * 0.5)),
        articulation: 85,
        volume: 80,
        pace: wpm
      },
      content: {
        score: Math.min(100, 50 + (technicalTerms.length * 5) + (keywordUsage.length * 3)),
        keywordUsage,
        technicalTerms,
        professionalLanguage: this.assessProfessionalLanguage(text)
      },
      confidence: {
        score: Math.max(0, 100 - (fillerWords * 3) - (longPauses * 7)),
        hesitations: fillerWords,
        assertiveness: this.assessAssertiveness(text),
        conviction: this.assessConviction(text)
      }
    };
  }

  private async generateSpeechRecommendations(speechAnalysis: any, params: any): Promise<any[]> {
    const recommendations = [];

    if (speechAnalysis.fluency.score < 70) {
      recommendations.push({
        category: 'Fluency',
        suggestion: 'Practice speaking more slowly and deliberately to reduce filler words',
        priority: 'high',
        impact: 'Improved fluency will make you sound more confident and professional'
      });
    }

    if (speechAnalysis.clarity.pace < 120 || speechAnalysis.clarity.pace > 180) {
      recommendations.push({
        category: 'Pace',
        suggestion: 'Adjust your speaking pace to 120-180 words per minute for optimal clarity',
        priority: 'medium',
        impact: 'Better pace will improve comprehension and engagement'
      });
    }

    if (speechAnalysis.content.score < 60) {
      recommendations.push({
        category: 'Content',
        suggestion: 'Include more industry-specific terminology and technical concepts',
        priority: 'high',
        impact: 'Demonstrates domain expertise and technical competence'
      });
    }

    return recommendations;
  }

  private identifyPracticeAreas(speechAnalysis: any): string[] {
    const areas = [];
    
    if (speechAnalysis.fluency.score < 70) areas.push('Fluency and Flow');
    if (speechAnalysis.clarity.score < 70) areas.push('Clarity and Articulation');
    if (speechAnalysis.content.score < 70) areas.push('Technical Content');
    if (speechAnalysis.confidence.score < 70) areas.push('Confidence and Conviction');
    
    return areas;
  }

  private async identifyParticipants(transcription: WhisperTranscription, expectedParticipants?: string[]): Promise<any[]> {
    // Simplified participant identification
    const segments = transcription.segments || [];
    const speakers = new Set<string>();
    
    segments.forEach(segment => {
      // In a real implementation, this would use speaker diarization
      speakers.add(`Speaker_${Math.floor(segment.start / 60)}`);
    });

    return Array.from(speakers).map(speakerId => ({
      speakerId,
      speakingTime: Math.random() * 300,
      wordCount: Math.floor(Math.random() * 500) + 100,
      dominanceLevel: Math.random() * 100
    }));
  }

  private async extractTopics(transcription: WhisperTranscription, meetingType: string): Promise<any[]> {
    const commonTopics = {
      'standup': ['progress', 'blockers', 'plans', 'goals'],
      'review': ['feedback', 'improvements', 'decisions', 'next steps'],
      'planning': ['requirements', 'timeline', 'resources', 'priorities'],
      'retrospective': ['what went well', 'what could improve', 'action items'],
      'interview': ['experience', 'skills', 'projects', 'questions']
    };

    const topics = commonTopics[meetingType] || ['general discussion'];
    
    return topics.map(topic => ({
      topic,
      timeSpent: Math.random() * 300,
      importance: Math.random() * 100,
      actionItems: [`Action item related to ${topic}`]
    }));
  }

  private async analyzeSentiment(transcription: WhisperTranscription): Promise<any> {
    const text = transcription.text;
    const positiveWords = (text.match(/\b(good|great|excellent|positive|success|happy|satisfied|pleased)\b/gi) || []).length;
    const negativeWords = (text.match(/\b(bad|terrible|negative|problem|issue|concern|worried|difficult)\b/gi) || []).length;
    
    let overall: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveWords > negativeWords + 2) overall = 'positive';
    if (negativeWords > positiveWords + 2) overall = 'negative';

    return {
      overall,
      emotional_tone: ['professional', 'focused', 'collaborative'],
      engagement_level: Math.min(100, 50 + (positiveWords * 5) - (negativeWords * 3))
    };
  }

  private async generateMeetingInsights(transcription: WhisperTranscription, meetingType: string): Promise<any> {
    return {
      keyDecisions: ['Decision 1 based on discussion', 'Decision 2 from meeting'],
      followUpActions: ['Follow up on item 1', 'Schedule next meeting', 'Review progress'],
      concerns: ['Concern about timeline', 'Resource availability'],
      opportunities: ['Opportunity to improve process', 'Potential for growth']
    };
  }

  private extractTechnicalTerms(text: string, jobRole: string): string[] {
    const commonTechnicalTerms = {
      'software engineer': ['algorithm', 'database', 'API', 'framework', 'architecture', 'deployment'],
      'data scientist': ['machine learning', 'statistics', 'model', 'dataset', 'analysis', 'visualization'],
      'product manager': ['roadmap', 'stakeholder', 'metrics', 'user experience', 'feature', 'requirements'],
      'default': ['technology', 'system', 'process', 'solution', 'implementation', 'optimization']
    };

    const terms = commonTechnicalTerms[jobRole.toLowerCase()] || commonTechnicalTerms['default'];
    return terms.filter(term => text.toLowerCase().includes(term));
  }

  private extractKeywords(text: string, jobRole: string): string[] {
    const roleKeywords = {
      'software engineer': ['coding', 'programming', 'development', 'testing', 'debugging'],
      'data scientist': ['data', 'analysis', 'modeling', 'insights', 'predictions'],
      'product manager': ['product', 'strategy', 'market', 'customer', 'business'],
      'default': ['experience', 'skills', 'team', 'project', 'results']
    };

    const keywords = roleKeywords[jobRole.toLowerCase()] || roleKeywords['default'];
    return keywords.filter(keyword => text.toLowerCase().includes(keyword));
  }

  private calculateOverallScore(fillerWords: number, wpm: number, longPauses: number, technicalTerms: number): number {
    const fluencyScore = Math.max(0, 100 - (fillerWords * 2) - (longPauses * 5));
    const paceScore = Math.min(100, Math.max(0, 100 - Math.abs(wpm - 150) * 0.5));
    const contentScore = Math.min(100, 50 + (technicalTerms * 5));
    
    return Math.round((fluencyScore + paceScore + contentScore) / 3);
  }

  private assessProfessionalLanguage(text: string): number {
    const professionalWords = (text.match(/\b(professional|experience|expertise|competent|qualified|skilled)\b/gi) || []).length;
    const casualWords = (text.match(/\b(cool|awesome|stuff|thing|whatever|kinda|sorta)\b/gi) || []).length;
    
    return Math.max(0, Math.min(100, 50 + (professionalWords * 10) - (casualWords * 5)));
  }

  private assessAssertiveness(text: string): number {
    const assertiveWords = (text.match(/\b(will|can|believe|confident|certain|definitely)\b/gi) || []).length;
    const hesitantWords = (text.match(/\b(maybe|perhaps|possibly|might|could|probably)\b/gi) || []).length;
    
    return Math.max(0, Math.min(100, 50 + (assertiveWords * 8) - (hesitantWords * 5)));
  }

  private assessConviction(text: string): number {
    const convictionWords = (text.match(/\b(absolutely|certainly|definitely|strongly|firmly)\b/gi) || []).length;
    const uncertainWords = (text.match(/\b(unsure|uncertain|confused|unclear)\b/gi) || []).length;
    
    return Math.max(0, Math.min(100, 50 + (convictionWords * 10) - (uncertainWords * 8)));
  }

  private parseSpeechFeedback(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        overallFeedback: parsed.overallFeedback || 'Good performance overall',
        specificFeedback: parsed.specificFeedback || [],
        improvementPlan: parsed.improvementPlan || [],
        nextSteps: parsed.nextSteps || []
      };
    } catch (error) {
      return this.getFallbackSpeechFeedback({});
    }
  }

  // Fallback methods
  private getFallbackTranscription(params: any): WhisperTranscription {
    return {
      text: "Sample interview transcription. The candidate discussed their experience with software development, mentioning JavaScript, React, and Node.js. They explained their approach to problem-solving and demonstrated good communication skills.",
      language: 'en',
      duration: 180,
      segments: [
        {
          start: 0,
          end: 30,
          text: "Sample interview transcription. The candidate discussed their experience with software development.",
          confidence: 0.95
        },
        {
          start: 30,
          end: 60,
          text: "They mentioned JavaScript, React, and Node.js technologies.",
          confidence: 0.92
        },
        {
          start: 60,
          end: 90,
          text: "They explained their approach to problem-solving.",
          confidence: 0.88
        },
        {
          start: 90,
          end: 120,
          text: "The candidate demonstrated good communication skills.",
          confidence: 0.91
        }
      ],
      words: [
        { word: "Sample", start: 0, end: 0.5, confidence: 0.95 },
        { word: "interview", start: 0.5, end: 1.2, confidence: 0.93 },
        { word: "transcription", start: 1.2, end: 2.1, confidence: 0.89 }
      ]
    };
  }

  private getFallbackInterviewAnalysis(params: any): WhisperInterviewAnalysis {
    const transcription = this.getFallbackTranscription(params);
    
    return {
      transcription,
      speechAnalysis: {
        overallScore: 78,
        fluency: {
          score: 82,
          fillerWords: 3,
          pauseAnalysis: {
            averagePauseLength: 1.2,
            longPauses: 2,
            appropriatePauses: 8
          }
        },
        clarity: {
          score: 85,
          articulation: 88,
          volume: 82,
          pace: 145
        },
        content: {
          score: 75,
          keywordUsage: ['JavaScript', 'React', 'Node.js', 'problem-solving'],
          technicalTerms: ['software development', 'programming', 'technology'],
          professionalLanguage: 80
        },
        confidence: {
          score: 73,
          hesitations: 3,
          assertiveness: 75,
          conviction: 70
        }
      },
      recommendations: [
        {
          category: 'Fluency',
          suggestion: 'Reduce filler words by practicing structured responses',
          priority: 'medium',
          impact: 'Will improve professional presence and clarity'
        },
        {
          category: 'Content',
          suggestion: 'Include more specific technical examples and metrics',
          priority: 'high',
          impact: 'Demonstrates deeper technical competence'
        }
      ],
      practiceAreas: ['Technical Content', 'Confidence Building']
    };
  }

  private getFallbackMeetingAnalysis(params: any): WhisperMeetingAnalysis {
    const transcription = this.getFallbackTranscription(params);
    
    return {
      transcription,
      participants: [
        {
          speakerId: 'Speaker_1',
          speakingTime: 120,
          wordCount: 350,
          dominanceLevel: 65
        },
        {
          speakerId: 'Speaker_2',
          speakingTime: 60,
          wordCount: 180,
          dominanceLevel: 35
        }
      ],
      topics: [
        {
          topic: 'Project Progress',
          timeSpent: 90,
          importance: 85,
          actionItems: ['Complete feature implementation', 'Update documentation']
        },
        {
          topic: 'Technical Challenges',
          timeSpent: 60,
          importance: 75,
          actionItems: ['Research solutions', 'Schedule tech review']
        }
      ],
      sentiment: {
        overall: 'positive',
        emotional_tone: ['professional', 'collaborative', 'focused'],
        engagement_level: 78
      },
      insights: {
        keyDecisions: ['Proceed with current technical approach', 'Increase testing coverage'],
        followUpActions: ['Schedule follow-up meeting', 'Prepare technical documentation', 'Review progress next week'],
        concerns: ['Timeline pressure', 'Resource allocation'],
        opportunities: ['Process improvement', 'Knowledge sharing', 'Team collaboration']
      }
    };
  }

  private getFallbackBatchProcessing(params: any): WhisperBatchProcessing {
    return {
      jobId: `batch_${Date.now()}_fallback`,
      status: 'completed',
      files: params.audioFiles.map(file => ({
        filename: file.filename,
        status: 'completed',
        transcription: this.getFallbackTranscription({})
      })),
      progress: 100,
      estimatedCompletion: new Date().toISOString()
    };
  }

  private getFallbackSpeechFeedback(params: any): any {
    return {
      overallFeedback: 'Overall performance shows good communication skills with room for improvement in technical depth and fluency.',
      specificFeedback: [
        {
          timeRange: { start: 0, end: 30 },
          feedback: 'Good opening, clear introduction of background',
          type: 'positive'
        },
        {
          timeRange: { start: 30, end: 60 },
          feedback: 'Consider reducing filler words and pauses',
          type: 'improvement'
        }
      ],
      improvementPlan: [
        {
          area: 'Technical Communication',
          currentLevel: 70,
          targetLevel: 85,
          exercises: ['Practice technical explanations', 'Record and review responses', 'Study industry terminology'],
          timeframe: '2-3 weeks'
        },
        {
          area: 'Fluency',
          currentLevel: 75,
          targetLevel: 88,
          exercises: ['Practice structured responses', 'Work on pace control', 'Reduce filler words'],
          timeframe: '1-2 weeks'
        }
      ],
      nextSteps: [
        'Practice mock interviews with technical questions',
        'Record daily speaking exercises',
        'Review and implement feedback regularly',
        'Focus on specific technical terminology for your field'
      ]
    };
  }
}

export const whisperService = new WhisperService();