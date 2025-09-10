"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Calendar,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

interface WeightEntry {
  id: string;
  user_id: string;
  weight_kg: number;
  measured_at: string;
  created_at: string | null;
}

interface ChartData {
  date: string;
  weight: number;
  displayDate: string;
}

export default function WeightLogPage() {
  const { user } = useAuthContext();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "3months"
  >("month");
  const [aiCooldown, setAiCooldown] = useState<number | null>(null);
  const [isRefreshingAI, setIsRefreshingAI] = useState(false);
  const [existingEntryForDate, setExistingEntryForDate] =
    useState<WeightEntry | null>(null);

  // Refs to prevent unnecessary re-fetches
  const hasFetchedWeights = useRef(false);
  const isInitialized = useRef(false);

  // Fetch weight entries
  const fetchWeightEntries = useCallback(async () => {
    if (hasFetchedWeights.current || !user) return;

    if (!supabase) {
      setError("Database connection not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      hasFetchedWeights.current = true;

      const { data, error: fetchError } = await supabase
        .from("weights")
        .select("*")
        .eq("user_id", user.id)
        .order("measured_at", { ascending: true });

      if (fetchError) throw fetchError;

      setWeightEntries(data || []);
    } catch (err) {
      console.error("Error fetching weight entries:", err);
      setError("Unable to load weight entries. Please try again.");
      hasFetchedWeights.current = false;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Check AI cooldown
  const checkAiCooldown = useCallback(async () => {
    if (!user || !supabase) return;

    try {
      const { data } = await supabase
        .from("diet_recommendations")
        .select("last_refreshed")
        .eq("user_id", user.id)
        .order("last_refreshed", { ascending: false })
        .limit(1)
        .single();

      if (data?.last_refreshed) {
        const lastRefresh = new Date(data.last_refreshed);
        const now = new Date();
        const hoursSinceLastRefresh =
          (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
        const remainingHours = Math.max(0, 168 - hoursSinceLastRefresh); // 168 hours = 1 week
        setAiCooldown(remainingHours);
      } else {
        setAiCooldown(0);
      }
    } catch (err) {
      console.error("Error checking AI cooldown:", err);
      setAiCooldown(0);
    }
  }, [user?.id]);

  // Check if there's already an entry for the selected date
  const checkExistingEntryForDate = useCallback(
    (date: string) => {
      const existing = weightEntries.find(
        (entry) => entry.measured_at === date
      );
      setExistingEntryForDate(existing || null);
    },
    [weightEntries]
  );

  // Check for existing entry when date changes
  useEffect(() => {
    if (selectedDate) {
      checkExistingEntryForDate(selectedDate);
    }
  }, [selectedDate, checkExistingEntryForDate]);

  // Initialize data fetching
  useEffect(() => {
    if (!isInitialized.current && user) {
      isInitialized.current = true;
      fetchWeightEntries();
      checkAiCooldown();
    }
  }, [fetchWeightEntries, checkAiCooldown, user]);

  // Add or update weight entry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !supabase) return;

    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight < 30 || weight > 300) {
      toast.error("Please enter a valid weight between 30-300 kg");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("weights")
          .update({
            weight_kg: weight,
            measured_at: selectedDate,
          })
          .eq("id", editingEntry.id);

        if (error) throw error;
        toast.success("Weight entry updated successfully");
      } else {
        // Add new entry
        const { error } = await supabase.from("weights").insert({
          user_id: user.id,
          weight_kg: weight,
          measured_at: selectedDate,
        });

        if (error) throw error;
        toast.success("Weight entry added successfully");
      }

      // Reset form
      setNewWeight("");
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setEditingEntry(null);
      setExistingEntryForDate(null);

      // Refresh data
      hasFetchedWeights.current = false;
      fetchWeightEntries();
    } catch (err) {
      console.error("Error saving weight entry:", err);

      // Handle duplicate date error specifically
      const error = err as { code?: string; message?: string };
      if (
        error?.code === "23505" ||
        error?.message?.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        toast.error(
          "You already have a weight entry for this date. Please edit the existing entry instead."
        );
      } else {
        toast.error("Unable to save entry. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete weight entry
  const handleDelete = async (entryId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("weights")
        .delete()
        .eq("id", entryId);

      if (error) throw error;
      toast.success("Weight entry deleted successfully");

      // Refresh data
      hasFetchedWeights.current = false;
      fetchWeightEntries();
    } catch (err) {
      console.error("Error deleting weight entry:", err);
      toast.error("Unable to delete entry. Try again.");
    }
  };

  // Start editing entry
  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setNewWeight(entry.weight_kg.toString());
    setSelectedDate(entry.measured_at);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setNewWeight("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setExistingEntryForDate(null);
  };

  // Refresh AI recommendations
  const handleRefreshAI = async () => {
    if (!user || !supabase || (aiCooldown !== null && aiCooldown > 0)) return;

    setIsRefreshingAI(true);

    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("AI recommendations refreshed successfully");
        checkAiCooldown(); // Update cooldown
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to refresh recommendations");
      }
    } catch (err) {
      console.error("Error refreshing AI recommendations:", err);
      toast.error("Unable to refresh recommendations. Try again.");
    } finally {
      setIsRefreshingAI(false);
    }
  };

  // Get chart data based on selected period
  const getChartData = (): ChartData[] => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3months":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return weightEntries
      .filter((entry) => new Date(entry.measured_at) >= startDate)
      .map((entry) => ({
        date: entry.measured_at,
        weight: entry.weight_kg,
        displayDate: entry.measured_at.split("-").reverse().join("/"),
      }));
  };

  // Format cooldown time
  const formatCooldown = (hours: number): string => {
    if (hours < 1) return "Available now";
    if (hours < 24) return `${Math.ceil(hours)}h remaining`;
    const days = Math.ceil(hours / 24);
    return `${days}d remaining`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-center">Loading weight log...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Unable to Load Weight Log
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => {
                hasFetchedWeights.current = false;
                fetchWeightEntries();
              }}
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weight Log</h1>
          <p className="text-gray-600 mt-1">
            Track your weight progress over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRefreshAI}
            disabled={(aiCooldown !== null && aiCooldown > 0) || isRefreshingAI}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {isRefreshingAI ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Update AI Recommendations</span>
          </Button>
          {aiCooldown !== null && aiCooldown > 0 && (
            <Badge variant="secondary">{formatCooldown(aiCooldown)}</Badge>
          )}
        </div>
      </div>

      {/* Add/Edit Weight Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>
              {editingEntry ? "Edit Weight Entry" : "Add New Weight Entry"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Enter your weight"
                  required
                  disabled={!!existingEntryForDate && !editingEntry}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  disabled={!!existingEntryForDate && !editingEntry}
                />
              </div>
            </div>

            {/* Show existing entry info */}
            {existingEntryForDate && !editingEntry && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      You already have a weight entry for this date
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(existingEntryForDate)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Weight: {existingEntryForDate.weight_kg} kg
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Click &quot;Edit&quot; to modify this entry, or choose a
                  different date.
                </p>
              </div>
            )}
            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={
                  isSubmitting || (!!existingEntryForDate && !editingEntry)
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingEntry ? "Updating..." : "Adding..."}
                  </>
                ) : editingEntry ? (
                  "Update Entry"
                ) : (
                  "Add Entry"
                )}
              </Button>
              {editingEntry && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Weight Entries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weight Entries ({weightEntries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weightEntries.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Weight Entries Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add your first weight entry to start tracking your progress.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {weightEntries
                .sort(
                  (a, b) =>
                    new Date(b.measured_at).getTime() -
                    new Date(a.measured_at).getTime()
                )
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{entry.weight_kg} kg</p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            entry.measured_at + "T00:00:00"
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Weight Progress</span>
              </CardTitle>
              <div className="flex space-x-2">
                {(["week", "month", "3months"] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === "week"
                      ? "1 Week"
                      : period === "month"
                      ? "1 Month"
                      : "3 Months"}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={["dataMin - 5", "dataMax + 5"]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload as ChartData;
                        return new Date(
                          data.date + "T00:00:00"
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                      }
                      return value;
                    }}
                    formatter={(value: number) => [`${value} kg`, "Weight"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
