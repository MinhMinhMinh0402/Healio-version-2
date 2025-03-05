import { SidebarNav } from "@/components/sidebar-nav";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { Brain, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SymptomCategory = 
  | "Head & Neurological" 
  | "Chest & Respiratory" 
  | "Abdominal" 
  | "Musculoskeletal" 
  | "Skin";

export default function AiAssistantPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState<SymptomCategory | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeSymptoms = useMutation({
    mutationFn: async (data: { category: SymptomCategory; symptoms: string }) => {
      setError(null);
      const res = await apiRequest("POST", "/api/ai-analysis", {
        userId: user?.id,
        category: data.category,
        symptoms: data.symptoms,
        date: new Date().toISOString(),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unable to analyze symptoms");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed successfully",
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      setAnalysis(null);
      toast({
        title: "Could Not Complete Analysis",
        description: "Please try again in a few moments",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!category || !symptoms.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a symptom category and describe your symptoms",
        variant: "destructive",
      });
      return;
    }
    analyzeSymptoms.mutate({ category, symptoms });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6">AI Diagnosis</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">Symptom Category</Label>
                <RadioGroup
                  value={category || ""}
                  onValueChange={(value) => setCategory(value as SymptomCategory)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Head & Neurological" id="head" />
                    <Label htmlFor="head">Head & Neurological</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Chest & Respiratory" id="chest" />
                    <Label htmlFor="chest">Chest & Respiratory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Abdominal" id="abdominal" />
                    <Label htmlFor="abdominal">Abdominal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Musculoskeletal" id="musculoskeletal" />
                    <Label htmlFor="musculoskeletal">Musculoskeletal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Skin" id="skin" />
                    <Label htmlFor="skin">Skin</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mb-4">
                <Label className="text-base font-medium mb-3 block">Describe your symptoms</Label>
                <Textarea
                  placeholder="Please describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[200px] bg-gray-50"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!category || !symptoms.trim() || analyzeSymptoms.isPending}
                className="w-full bg-primary text-white"
              >
                {analyzeSymptoms.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">AI Analysis</h2>
              </div>

              {error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    Our AI system is currently unavailable. Please try again in a few moments.
                  </AlertDescription>
                </Alert>
              ) : analysis ? (
                <div className="prose prose-sm">
                  <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  {analyzeSymptoms.isPending ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p>Analyzing your symptoms...</p>
                    </div>
                  ) : (
                    "Select a category and describe your symptoms for an AI-powered analysis"
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}