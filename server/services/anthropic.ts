import Anthropic from '@anthropic-ai/sdk';

/*
The newest Anthropic model is "claude-sonnet-4-20250514", not "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022" nor "claude-3-sonnet-20240229". 
If the user doesn't specify a model, always prefer using "claude-sonnet-4-20250514" as it is the latest model.
*/

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AnthropicService {
  async analyzeJobDescription(jobDescription: string): Promise<any> {
    try {
      const prompt = `Analyze this job description and extract key information:

${jobDescription}

Please provide a JSON response with:
{
  "requiredSkills": ["skill1", "skill2", ...],
  "preferredSkills": ["skill1", "skill2", ...],
  "experienceLevel": "entry|mid|senior",
  "keyResponsibilities": ["responsibility1", "responsibility2", ...],
  "companyBenefits": ["benefit1", "benefit2", ...],
  "salaryRange": { "min": number, "max": number },
  "workType": "remote|hybrid|onsite",
  "summary": "brief summary of the role"
}`;

      const message = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        model: DEFAULT_MODEL_STR,
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error("Failed to analyze job description:", error);
      return null;
    }
  }

  async generateInterviewQuestions(jobTitle: string, industry: string, level: string): Promise<any> {
    try {
      const prompt = `Generate comprehensive interview questions for a ${jobTitle} position in the ${industry} industry at ${level} level.

Create questions covering:
1. Technical competencies
2. Behavioral scenarios
3. Industry-specific knowledge
4. Problem-solving abilities
5. Cultural fit

For each question, provide:
- The question text
- Question category
- Difficulty level
- What to look for in answers
- Follow-up questions

Return as JSON with a questions array.`;

      const message = await anthropic.messages.create({
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
        model: DEFAULT_MODEL_STR,
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error("Failed to generate interview questions:", error);
      return { questions: [] };
    }
  }

  async evaluateResumeQuality(resumeContent: any): Promise<any> {
    try {
      const prompt = `Evaluate this resume for quality and ATS compatibility:

${JSON.stringify(resumeContent)}

Provide a comprehensive evaluation including:
1. Overall quality score (0-100)
2. ATS compatibility score (0-100)
3. Strengths and weaknesses
4. Specific improvement recommendations
5. Keyword optimization suggestions
6. Format and structure feedback

Return as JSON with detailed analysis.`;

      const message = await anthropic.messages.create({
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
        model: DEFAULT_MODEL_STR,
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error("Failed to evaluate resume quality:", error);
      return { score: 0, feedback: "Evaluation failed" };
    }
  }

  async generateCareerAdvice(userProfile: any): Promise<any> {
    try {
      const prompt = `Based on this user profile, provide personalized career advice:

${JSON.stringify(userProfile)}

Include:
1. Career path recommendations
2. Skill development suggestions
3. Industry insights
4. Networking advice
5. Goal-setting recommendations
6. Market opportunities

Return as JSON with structured advice.`;

      const message = await anthropic.messages.create({
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
        model: DEFAULT_MODEL_STR,
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error("Failed to generate career advice:", error);
      return { advice: "Unable to generate advice at this time" };
    }
  }

  async optimizeJobSearch(searchCriteria: any, userProfile: any): Promise<any> {
    try {
      const prompt = `Optimize job search strategy based on:

Search Criteria: ${JSON.stringify(searchCriteria)}
User Profile: ${JSON.stringify(userProfile)}

Provide:
1. Optimized search keywords
2. Target companies and roles
3. Application strategy
4. Timeline recommendations
5. Success metrics to track

Return as JSON with actionable recommendations.`;

      const message = await anthropic.messages.create({
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
        model: DEFAULT_MODEL_STR,
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error("Failed to optimize job search:", error);
      return { recommendations: [] };
    }
  }
}

export const anthropicService = new AnthropicService();
