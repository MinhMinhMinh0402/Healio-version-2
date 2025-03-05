import { SidebarNav } from "@/components/sidebar-nav";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { Bot, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function AiAssistantPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);

  const analyzeSymptoms = useMutation({
    mutationFn: async (symptoms: string) => {
      const res = await apiRequest("POST", "/api/ai-analysis", {
        userId: user?.id,
        symptoms,
        analysis: "Analysis will be provided here", // In a real app, this would come from an AI service
        date: new Date(),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed",
      });
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6">AI Health Assistant</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Describe Your Symptoms
                </label>
                <Textarea
                  placeholder="Please describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <Button
                onClick={() => analyzeSymptoms.mutate(symptoms)}
                disabled={!symptoms || analyzeSymptoms.isPending}
                className="w-full"
              >
                {analyzeSymptoms.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Get AI Analysis
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">AI Analysis</h2>
              </div>
              
              {analysis ? (
                <div className="prose prose-sm">
                  <p>{analysis}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  Describe your symptoms and our AI will provide a preliminary analysis
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
