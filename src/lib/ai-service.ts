import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Free tier limits (requests per minute)
  REQUESTS_PER_MINUTE: 15,
  // Free tier limits (requests per day)
  REQUESTS_PER_DAY: 1500,
  // Token limits per request
  MAX_TOKENS_PER_REQUEST: 1000,
  // Cooldown period for recommendations (1 week in milliseconds)
  RECOMMENDATION_COOLDOWN: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = {
  requests: new Map<string, number[]>(),
  dailyRequests: new Map<string, number>(),
  lastReset: Date.now(),
};

// AI Service Configuration
class AIService {
  private genAI?: GoogleGenerativeAI;
  private model?: GenerativeModel;
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Gemini API key not found. AI features will be disabled.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: RATE_LIMIT_CONFIG.MAX_TOKENS_PER_REQUEST,
        } as GenerationConfig,
      });
      this.isConfigured = true;
    } catch (error) {
      console.error('Failed to initialize Google Gemini AI:', error);
    }
  }

  /**
   * Check if the AI service is properly configured
   */
  isAvailable(): boolean {
    return this.isConfigured && !!this.model && !!this.genAI;
  }

  /**
   * Rate limiting check
   */
  private checkRateLimit(userId: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const userKey = `user_${userId}`;
    
    // Reset daily counter if it's a new day
    if (now - rateLimitStore.lastReset > 24 * 60 * 60 * 1000) {
      rateLimitStore.dailyRequests.clear();
      rateLimitStore.lastReset = now;
    }

    // Check daily limit
    const dailyCount = rateLimitStore.dailyRequests.get(userKey) || 0;
    if (dailyCount >= RATE_LIMIT_CONFIG.REQUESTS_PER_DAY) {
      const resetTime = rateLimitStore.lastReset + 24 * 60 * 60 * 1000;
      return { allowed: false, resetTime };
    }

    // Check per-minute limit
    const userRequests = rateLimitStore.requests.get(userKey) || [];
    const oneMinuteAgo = now - 60 * 1000;
    const recentRequests = userRequests.filter(time => time > oneMinuteAgo);
    
    if (recentRequests.length >= RATE_LIMIT_CONFIG.REQUESTS_PER_MINUTE) {
      const oldestRequest = Math.min(...recentRequests);
      const resetTime = oldestRequest + 60 * 1000;
      return { allowed: false, resetTime };
    }

    // Update counters
    recentRequests.push(now);
    rateLimitStore.requests.set(userKey, recentRequests);
    rateLimitStore.dailyRequests.set(userKey, dailyCount + 1);

    return { allowed: true };
  }

  /**
   * Generate diet recommendations using Gemini
   */
  async generateDietRecommendations(
    userProfile: {
      userId: string;
      age?: number;
      gender?: string;
      weight?: number;
      height?: number;
      activityLevel?: string;
      dietaryRestrictions?: string[];
      goals?: string[];
      preferences?: string[];
    },
    availableDiets: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty: string;
      calories_total: number;
      tags: string[];
    }>
  ): Promise<{
    success: boolean;
    recommendations?: Array<{
      dietId: string;
      score: number;
      reasoning: string;
    }>;
    error?: string;
    rateLimited?: boolean;
    resetTime?: number;
  }> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'AI service is not available. Please check configuration.',
      };
    }

    // Check rate limiting
    const rateLimitCheck = this.checkRateLimit(userProfile.userId);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        rateLimited: true,
        resetTime: rateLimitCheck.resetTime,
      };
    }

    try {
      const prompt = this.buildRecommendationPrompt(userProfile, availableDiets);
      
      if (!this.model) {
        throw new Error('AI model not initialized');
      }
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the AI response
      const recommendations = this.parseRecommendations(text, availableDiets);
      
      return {
        success: true,
        recommendations,
      };
    } catch (error) {
      console.error('Error generating diet recommendations:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          return {
            success: false,
            error: 'Invalid API key. Please check configuration.',
          };
        }
        if (error.message.includes('QUOTA_EXCEEDED')) {
          return {
            success: false,
            error: 'API quota exceeded. Please try again later.',
            rateLimited: true,
          };
        }
        if (error.message.includes('SAFETY')) {
          return {
            success: false,
            error: 'Content blocked by safety filters. Please try different inputs.',
          };
        }
      }

      return {
        success: false,
        error: 'Failed to generate recommendations. Please try again later.',
      };
    }
  }

  /**
   * Build the prompt for diet recommendations
   */
  private buildRecommendationPrompt(
    userProfile: UserProfile,
    availableDiets: Array<{
      id: string;
      title: string;
      category: string;
      difficulty: string;
      calories_total: number;
      tags: string[];
    }>
  ): string {
    const dietList = availableDiets.map(diet => 
      `ID: ${diet.id}, Title: ${diet.title}, Category: ${diet.category}, Difficulty: ${diet.difficulty}, Calories: ${diet.calories_total}, Tags: ${diet.tags.join(', ')}`
    ).join('\n');

    return `
You are a nutrition expert AI assistant. Analyze the user profile and available diets to recommend the best 3-5 diets.

User Profile:
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Weight: ${userProfile.weight || 'Not specified'} kg
- Height: ${userProfile.height || 'Not specified'} cm
- Activity Level: ${userProfile.activityLevel || 'Not specified'}
- Dietary Restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None'}
- Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
- Preferences: ${userProfile.preferences?.join(', ') || 'Not specified'}

Available Diets:
${dietList}

Please provide your recommendations in the following JSON format:
{
  "recommendations": [
    {
      "dietId": "diet_id_here",
      "score": 0.85,
      "reasoning": "Brief explanation of why this diet is recommended for this user"
    }
  ]
}

Consider factors like:
- User's dietary restrictions and preferences
- Activity level and calorie needs
- Health goals and objectives
- Diet difficulty matching user's experience level
- Category preferences

Return only the JSON response, no additional text.
    `.trim();
  }

  /**
   * Parse AI response into structured recommendations
   */
  private parseRecommendations(
    aiResponse: string,
    availableDiets: Array<{ id: string }>
  ): Array<{ dietId: string; score: number; reasoning: string }> {
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const recommendations = parsed.recommendations || [];

      // Validate and filter recommendations
      return recommendations
        .filter((rec: { dietId: string; score: number; reasoning: string }) => 
          rec.dietId && 
          rec.score && 
          rec.reasoning &&
          availableDiets.some(diet => diet.id === rec.dietId)
        )
        .map((rec: { dietId: string; score: number; reasoning: string }) => ({
          dietId: rec.dietId,
          score: Math.min(Math.max(rec.score, 0), 1), // Clamp between 0 and 1
          reasoning: rec.reasoning.substring(0, 500), // Limit reasoning length
        }))
        .sort((a: { score: number }, b: { score: number }) => b.score - a.score) // Sort by score descending
        .slice(0, 5); // Limit to top 5 recommendations

    } catch (error) {
      console.error('Error parsing AI recommendations:', error);
      return [];
    }
  }

  /**
   * Check if user can request new recommendations (cooldown check)
   */
  canRequestRecommendations(userId: string, lastRequestTime?: number): {
    allowed: boolean;
    cooldownRemaining?: number;
  } {
    if (!lastRequestTime) {
      return { allowed: true };
    }

    const timeSinceLastRequest = Date.now() - lastRequestTime;
    const cooldownRemaining = RATE_LIMIT_CONFIG.RECOMMENDATION_COOLDOWN - timeSinceLastRequest;

    if (cooldownRemaining > 0) {
      return {
        allowed: false,
        cooldownRemaining,
      };
    }

    return { allowed: true };
  }

  /**
   * Get rate limit status for a user
   */
  getRateLimitStatus(userId: string): {
    dailyUsed: number;
    dailyLimit: number;
    minuteUsed: number;
    minuteLimit: number;
  } {
    const userKey = `user_${userId}`;
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    const userRequests = rateLimitStore.requests.get(userKey) || [];
    const recentRequests = userRequests.filter(time => time > oneMinuteAgo);
    
    return {
      dailyUsed: rateLimitStore.dailyRequests.get(userKey) || 0,
      dailyLimit: RATE_LIMIT_CONFIG.REQUESTS_PER_DAY,
      minuteUsed: recentRequests.length,
      minuteLimit: RATE_LIMIT_CONFIG.REQUESTS_PER_MINUTE,
    };
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export types
export type UserProfile = {
  userId: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  activityLevel?: string;
  dietaryRestrictions?: string[];
  goals?: string[];
  preferences?: string[];
};

export type DietRecommendation = {
  dietId: string;
  score: number;
  reasoning: string;
};

export type AIResponse = {
  success: boolean;
  recommendations?: DietRecommendation[];
  error?: string;
  rateLimited?: boolean;
  resetTime?: number;
};
