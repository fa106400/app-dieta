import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';
import { calculateEstimatedCalories } from './calorie-calculator';

// Feature flag: AI debug mode
const AI_DEBUG_MODE = String(process.env.AI_DEBUG_MODE || '').toLowerCase() === 'true';

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
    console.debug('🔍 AI Service - AI debug mode:', AI_DEBUG_MODE);
    
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
    if (AI_DEBUG_MODE) return true; // In debug mode, always report available
    return this.isConfigured && !!this.model && !!this.genAI;
  }

  /**
   * Rate limiting check
   */
  private checkRateLimit(userId: string): { allowed: boolean; resetTime?: number } {
    if (AI_DEBUG_MODE) {
      // Bypass all limits in debug mode
      return { allowed: true };
    }
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
      // difficulty: string;
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
        error: 'Serviço AI não disponível. Por favor, acione o suporte.',
      };
    }

    // Check rate limiting
    const rateLimitCheck = this.checkRateLimit(userProfile.userId);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: 'Limite de requisições excedido. Por favor, acione o suporte.',
        rateLimited: true,
        resetTime: rateLimitCheck.resetTime,
      };
    }

    try {
      if (AI_DEBUG_MODE) {
        // Return mocked recommendations without calling the API
        const mocked = this.buildMockRecommendations(availableDiets);
        return { success: true, recommendations: mocked };
      }
      const prompt = this.buildRecommendationPrompt(userProfile, availableDiets);
      
      if (!this.model) {
        throw new Error('Modelo AI não inicializado');
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
      console.error('Erro ao gerar recomendações de dieta:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          return {
            success: false,
            error: 'Chave API inválida. Por favor, acione o suporte.',
          };
        }
        if (error.message.includes('QUOTA_EXCEEDED')) {
          return {
            success: false,
            error: 'Quota de API excedida. Por favor, acione o suporte.',
            rateLimited: true,
          };
        }
        if (error.message.includes('SAFETY')) {
          return {
            success: false,
            error: 'Conteúdo bloqueado por filtros de segurança. Por favor, acione o suporte.',
          };
        }
      }

      return {
        success: false,
        error: 'Falha ao gerar recomendações. Por favor, acione o suporte.',
      };
    }
  }

  /**
   * Build mocked recommendations for debug mode
   */
  private buildMockRecommendations(
    availableDiets: Array<{ id: string; title: string; description: string; category: string; calories_total: number; tags: string[] }>
  ): Array<{ dietId: string; score: number; reasoning: string }> {
    // Pick up to 2 diets deterministically
    const picks = availableDiets.slice(0, Math.min(2, availableDiets.length));
    return picks.map((diet, index) => ({
      dietId: diet.id,
      score: Math.max(0.45, 0.8 - index * 0.1),
      reasoning: `Mocked: The ${diet.title} (${diet.calories_total} kcal) is a suitable option based on category '${diet.category}', and tags ${diet.tags.slice(0,2).join(', ')}.`,
    }));
  }

  /**
   * Build the prompt for diet recommendations with enhanced matching logic
   */
  private buildRecommendationPrompt(
    userProfile: UserProfile,
    availableDiets: Array<{
      id: string;
      title: string;
      category: string;
      // difficulty: string;
      calories_total: number;
      tags: string[];
    }>
  ): string {
    const dietList = availableDiets.map(diet => 
      `ID: ${diet.id}, Title: ${diet.title}, Category: ${diet.category}, Calories: ${diet.calories_total}, Tags: ${diet.tags.join(', ')}`
    ).join('\n');

    // Calculate user's estimated daily calorie needs
    const estimatedCalories = calculateEstimatedCalories(userProfile);

    return `
You are a nutrition expert AI assistant specializing in personalized diet recommendations. Analyze the user profile and available diets to recommend the best 2 diets with detailed matching logic.

USER PROFILE ANALYSIS:
- Age: ${userProfile.age || 'Not specified'} years
- Weight: ${userProfile.weight || 'Not specified'} kg
- Height: ${userProfile.height || 'Not specified'} cm
- Activity Level: ${userProfile.activityLevel || 'Not specified'}
- Dietary Restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None'}
- Health Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
- Food Preferences: ${userProfile.preferences?.join(', ') || 'Not specified'}
- Estimated Daily Calorie Needs: ${estimatedCalories} calories

AVAILABLE DIETS:
${dietList}

MATCHING CRITERIA (in order of importance):
1. DIETARY COMPATIBILITY: Match dietary restrictions and preferences
2. CALORIE ALIGNMENT: Compare diet calories with user's estimated needs (±200 calories ideal)
3. GOAL ALIGNMENT: Match diet category with user's health goals
4. TAG RELEVANCE: Consider diet tags for additional personalization

SCORING METHODOLOGY:
- Base score: 0.0 to 1.0
- Dietary compatibility: +0.3 if perfect match, +0.2 if partial match
- Calorie alignment: +0.25 if within ±200 calories, +0.15 if within ±400 calories
- Goal alignment: +0.2 if category matches goal, +0.1 if related
- Tag relevance: +0.1 for each relevant tag match

Please provide your recommendations in the following JSON format:
{
  "recommendations": [
    {
      "dietId": "diet_id_here",
      "score": 0.85,
      "reasoning": "Detailed explanation of why this diet is recommended, including specific matching factors and how it aligns with the user's profile. This MUST be in pt-BR language!"
    }
  ]
}

REQUIREMENTS:
- Provide exactly 2 recommendations
- Scores should be between 0.0 and 1.0
- Reasoning should be specific, detailed (2-3 sentences) and in pt-BR language 
- Prioritize diets that best match the user's profile
- Consider the user's complete profile holistically

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
        throw new Error('Nenhum JSON encontrado na resposta. Acione o suporte.');
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
   * Check if user can request new recommendations (per-user cooldown check)
   * Uses the last_refreshed timestamp from diet_recommendations table
   */
  canRequestRecommendations(userId: string, lastRefreshedTime?: string): {
    allowed: boolean;
    cooldownRemaining?: number;
    cooldownHours?: number;
  } {
    if (AI_DEBUG_MODE) {
      // Always allow in debug mode
      return { allowed: true };
    }
    if (!lastRefreshedTime) {
      return { allowed: true };
    }

    const lastRefreshTimestamp = new Date(lastRefreshedTime).getTime();
    const timeSinceLastRefresh = Date.now() - lastRefreshTimestamp;
    const cooldownRemaining = RATE_LIMIT_CONFIG.RECOMMENDATION_COOLDOWN - timeSinceLastRefresh;

    if (cooldownRemaining > 0) {
      const cooldownHours = Math.ceil(cooldownRemaining / (1000 * 60 * 60));
      return {
        allowed: false,
        cooldownRemaining,
        cooldownHours,
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

  /**
   * Generate initial recommendations after onboarding completion
   * This function is called automatically after user completes onboarding
   */
  async generateInitialRecommendations(
    userId: string,
    userProfile: UserProfile,
    availableDiets: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      // difficulty: string;
      calories_total: number;
      tags: string[];
    }>
  ): Promise<{
    success: boolean;
    recommendations?: DietRecommendation[];
    error?: string;
  }> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'Serviço AI não disponível. Por favor, acione o suporte.',
      };
    }

    try {
      // Generate recommendations using the enhanced matching logic
      const aiResponse = await this.generateDietRecommendations(userProfile, availableDiets);
      
      if (!aiResponse.success) {
        return {
          success: false,
          error: aiResponse.error || 'Falha ao gerar recomendações',
        };
      }

      if (!aiResponse.recommendations || aiResponse.recommendations.length === 0) {
        return {
          success: false,
          error: 'Nenhuma recomendação gerada',
        };
      }

      return {
        success: true,
        recommendations: aiResponse.recommendations,
      };
    } catch (error) {
      console.error('Erro ao gerar recomendações iniciais:', error);
      return {
        success: false,
        error: 'Falha ao gerar recomendações iniciais',
      };
    }
  }

  /**
   * Enhanced recommendation logic with advanced matching algorithms
  
  async generateAdvancedRecommendations(
    userProfile: UserProfile,
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
    recommendations?: DietRecommendation[];
    error?: string;
    matchingFactors?: {
      dietaryCompatibility: number;
      calorieAlignment: number;
      goalAlignment: number;
      difficultySuitability: number;
      tagRelevance: number;
    };
  }> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'AI service is not available. Please check configuration.',
      };
    }

    try {
      // Calculate matching factors for analysis
      const matchingFactors = this.calculateMatchingFactors(userProfile, availableDiets);
      
      // Generate recommendations with enhanced prompt
      const aiResponse = await this.generateDietRecommendations(userProfile, availableDiets);
      
      if (!aiResponse.success) {
        return {
          success: false,
          error: aiResponse.error || 'Failed to generate recommendations',
        };
      }

      return {
        success: true,
        recommendations: aiResponse.recommendations,
        matchingFactors,
      };
    } catch (error) {
      console.error('🔍 AI Service - Error in advanced recommendations:', error);
      return {
        success: false,
        error: 'Failed to generate advanced recommendations',
      };
    }
  }
  */

  /**
   * Calculate matching factors for recommendation analysis
   
  private calculateMatchingFactors(
    userProfile: UserProfile,
    availableDiets: Array<{
      id: string;
      title: string;
      category: string;
      difficulty: string;
      calories_total: number;
      tags: string[];
    }>
  ): {
    dietaryCompatibility: number;
    calorieAlignment: number;
    goalAlignment: number;
    difficultySuitability: number;
    tagRelevance: number;
  } {
    const estimatedCalories = calculateEstimatedCalories(userProfile);
    
    // Calculate average matching factors across all diets
    let totalDietaryCompatibility = 0;
    let totalCalorieAlignment = 0;
    let totalGoalAlignment = 0;
    let totalDifficultySuitability = 0;
    let totalTagRelevance = 0;
    
    availableDiets.forEach(diet => {
      // Dietary compatibility (simplified)
      const dietaryMatch = this.calculateDietaryCompatibility(userProfile, diet);
      totalDietaryCompatibility += dietaryMatch;
      
      // Calorie alignment
      const calorieDiff = Math.abs(diet.calories_total - estimatedCalories);
      const calorieAlignment = calorieDiff <= 200 ? 1 : calorieDiff <= 400 ? 0.5 : 0;
      totalCalorieAlignment += calorieAlignment;
      
      // Goal alignment
      const goalAlignment = this.calculateGoalAlignment(userProfile, diet);
      totalGoalAlignment += goalAlignment;
      
      // Difficulty suitability
      const difficultySuitability = this.calculateDifficultySuitability(userProfile, diet);
      totalDifficultySuitability += difficultySuitability;
      
      // Tag relevance
      const tagRelevance = this.calculateTagRelevance(userProfile, diet);
      totalTagRelevance += tagRelevance;
    });
    
    const dietCount = availableDiets.length;
    
    return {
      dietaryCompatibility: totalDietaryCompatibility / dietCount,
      calorieAlignment: totalCalorieAlignment / dietCount,
      goalAlignment: totalGoalAlignment / dietCount,
      difficultySuitability: totalDifficultySuitability / dietCount,
      tagRelevance: totalTagRelevance / dietCount,
    };
  }
  */

  /**
   * Calculate dietary compatibility score
   
  private calculateDietaryCompatibility(userProfile: UserProfile, _diet: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    calories_total: number;
    tags: string[];
  }): number {
    if (!userProfile.dietaryRestrictions || userProfile.dietaryRestrictions.length === 0) {
      return 1; // No restrictions, perfect compatibility
    }
    
    // This is a simplified calculation - in a real implementation,
    // you'd have more sophisticated matching logic
    return 0.8; // Placeholder
  }
  */

  /**
   * Calculate goal alignment score
   
  private calculateGoalAlignment(userProfile: UserProfile, diet: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    calories_total: number;
    tags: string[];
  }): number {
    if (!userProfile.goals || userProfile.goals.length === 0) {
      return 0.5; // Neutral if no goals specified
    }
    
    // Map goals to diet categories
    const goalCategoryMap: { [key: string]: string[] } = {
      'lose_weight': ['weight_loss', 'low_calorie', 'keto'],
      'gain_muscle': ['muscle_gain', 'high_protein', 'bodybuilding'],
      'maintain': ['balanced', 'maintenance', 'healthy'],
      'health': ['mediterranean', 'heart_healthy', 'anti_inflammatory']
    };
    
    const relevantCategories = userProfile.goals.flatMap(goal => 
      goalCategoryMap[goal] || []
    );
    
    return relevantCategories.includes(diet.category) ? 1 : 0.3;
  }
  */

  /**
   * Calculate difficulty suitability score
   
  private calculateDifficultySuitability(_userProfile: UserProfile, _diet: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    calories_total: number;
    tags: string[];
  }): number {
    // This is a simplified calculation - in a real implementation,
    // you'd consider user's experience level, time constraints, etc.
    return 0.7; // Placeholder
  }
  */

  /**
   * Calculate tag relevance score
   
  private calculateTagRelevance(userProfile: UserProfile, diet: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    calories_total: number;
    tags: string[];
  }): number {
    if (!userProfile.preferences || userProfile.preferences.length === 0) {
      return 0.5; // Neutral if no preferences
    }
    
    const matchingTags = diet.tags.filter((tag: string) => 
      userProfile.preferences?.some(pref => 
        pref.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(pref.toLowerCase())
      )
    );
    
    return Math.min(matchingTags.length / diet.tags.length, 1);
  }
  */
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
