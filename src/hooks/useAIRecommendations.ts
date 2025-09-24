import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import type { Json } from '../../supabase';

export interface DietRecommendation {
  id: string;
  score: number;
  reasoning: string;
  created_at: string;
  diet: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    calories_total: number;
    shopping_plan: Json;
    tags: string[];
  } | null;
}

export interface AIRecommendationsState {
  recommendations: DietRecommendation[];
  loading: boolean;
  error: string | null;
  canRequestNew: boolean;
  cooldownRemaining?: number;
  rateLimitStatus?: {
    dailyUsed: number;
    dailyLimit: number;
    minuteUsed: number;
    minuteLimit: number;
  };
}

export function useAIRecommendations() {
  const { user } = useAuthContext();
  const [state, setState] = useState<AIRecommendationsState>({
    recommendations: [],
    loading: false,
    error: null,
    canRequestNew: true,
  });

  // Fetch existing recommendations
  const fetchRecommendations = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/ai/recommendations');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao buscar recomendações');
      }

      setState(prev => ({
        ...prev,
        loading: false,
        recommendations: data.recommendations || [],
        canRequestNew: data.canRequestNew,
        cooldownRemaining: data.cooldownRemaining,
        rateLimitStatus: data.rateLimitStatus,
      }));
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Falha ao buscar recomendações',
      }));
    }
  }, [user]);

  // Generate new recommendations
  const generateRecommendations = useCallback(async (forceRefresh = false) => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceRefresh }),
      });

      const data = await response.json();

      if (!response.ok) {
      if (response.status === 429) {
        // Rate limited or cooldown
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || data.error,
          canRequestNew: false,
          cooldownRemaining: data.cooldownRemaining || (data.cooldownHours ? data.cooldownHours * 60 * 60 * 1000 : undefined),
        }));
        return;
      }
        throw new Error(data.error || 'Falha ao gerar recomendações');
      }

      setState(prev => ({
        ...prev,
        loading: false,
        recommendations: data.recommendations || [],
        canRequestNew: true,
        cooldownRemaining: undefined,
      }));
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Falha ao gerar recomendações',
      }));
    }
  }, [user]);

  // Format cooldown time for display
  const formatCooldownTime = useCallback((milliseconds?: number) => {
    if (!milliseconds) return null;

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Check if AI service is available
  const isAIAvailable = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/status');
      const data = await response.json();
      return data.available || false;
    } catch {
      return false;
    }
  }, []);

  // Load recommendations on mount
  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, fetchRecommendations]);

  return {
    ...state,
    fetchRecommendations,
    generateRecommendations,
    formatCooldownTime,
    isAIAvailable,
  };
}
