import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { QuizService } from "@/services/quiz-service";
import { Quiz } from "@/types/quiz";
import { toast } from "sonner";
import { ChevronLeftIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuizPlayPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [quizType, setQuizType] = useState("regular");
  
  // AI Quiz parameters
  const [topic, setTopic] = useState("");
  const [size, setSize] = useState<number>(10);
  const [level, setLevel] = useState("MEDIUM");
  const [customQuizId, setCustomQuizId] = useState("");
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId && quizType === "regular") {
        // Allow the page to continue loading for custom quiz ID input
        setIsLoading(false);
        return;
      }
      
      if (quizId) {
        try {
          setIsLoading(true);
          const data = await QuizService.getQuiz(quizId);
          setQuiz(data);
          setQuizType("regular");
        } catch (error) {
          toast.error("Failed to load quiz details");
          // Don't navigate away in case user wants to try AI quiz
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId, navigate]);
  
  const handleStartQuiz = () => {
    if (quizType === "regular" && !quizId && !customQuizId) {
      toast.error("Please enter a Quiz ID");
      return;
    }
    
    if (quizType === "ai") {
      if (!topic) {
        toast.error("Please enter a topic");
        return;
      }
      if (!size || size < 1) {
        toast.error("Please enter a valid size");
        return;
      }
      if (!level) {
        toast.error("Please select a difficulty level");
        return;
      }
    }
    
    setStarted(true);
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="animate-pulse">Loading quiz...</div>
        </div>
      </MainLayout>
    );
  }
  
  if (!started) {
    return (
      <MainLayout>
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => navigate('/quizzes')}
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Play Quiz</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs defaultValue={quizType} onValueChange={(value) => setQuizType(value)}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="regular">Predefined Quiz</TabsTrigger>
                  <TabsTrigger value="ai">AI Practice Quiz</TabsTrigger>
                </TabsList>
                
                <TabsContent value="regular" className="space-y-4">
                  {quizId ? (
                    <>
                      <h3 className="text-lg font-medium">{quiz?.title}</h3>
                      <p>{quiz?.description}</p>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium">Quiz Details:</h3>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>Number of questions: {quiz?.questionsCount || 0}</li>
                          <li>Created by: {quiz?.createdBy || 'You'}</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="quizId">Quiz ID</Label>
                        <Input
                          id="quizId"
                          value={customQuizId}
                          onChange={(e) => setCustomQuizId(e.target.value)}
                          placeholder="Enter the Quiz ID"
                        />
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg p-4 text-sm">
                        <p>Enter a Quiz ID to start a predefined quiz.</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="ai" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. JavaScript, History, Science"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="size">Number of Questions</Label>
                      <Input
                        id="size"
                        type="number"
                        min="1"
                        max="20"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="level">Difficulty Level</Label>
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 text-sm">
                      <p>The AI will generate a custom quiz based on your specifications.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium">Instructions:</h3>
                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                  <li>Read each question carefully before answering.</li>
                  <li>Once you submit an answer, you cannot change it.</li>
                  <li>Your results will be shown at the end of the quiz.</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter>
              <div className="w-full flex justify-center">
                <Button size="lg" onClick={handleStartQuiz}>
                  Start Quiz
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {quizType === "regular" ? (
          <QuizPlayer quizId={quizId || customQuizId} />
        ) : (
          <QuizPlayer aiQuizParams={{ topic, size, level }} />
        )}
      </div>
    </MainLayout>
  );
}