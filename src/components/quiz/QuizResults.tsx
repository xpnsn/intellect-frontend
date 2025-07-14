import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { QuizService } from "@/services/quiz-service";
import { QuizResult } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

interface QuizResultsProps {
  quizId?: string;
}

export function QuizResults({ quizId }: QuizResultsProps) {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        let data: QuizResult[] = [];

        // If a specific quiz ID is provided, get results for that quiz
        if (quizId) {
          data = await QuizService.getQuizResults(quizId);
        } 
        // If no quiz ID but user has resultIds, fetch by result IDs
        else if (user?.resultId && user.resultId.length > 0) {
          data = await QuizService.getResultsByIds(user.resultId);
        } 
        // Fallback to generic results endpoint
        else {
          data = await QuizService.getQuizResults();
        }
        
        setResults(data);
      } catch (error) {
        toast.error("Failed to load results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [quizId, user]);

  const calculateTimeTaken = (startedAt: string, endedAt: string): string => {
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Loading results...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No results found. You haven't completed any quizzes yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={result.resultID || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-medium text-lg">Quiz #{index + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed on {format(parseISO(result.endedAt), "MMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">
                    Score: {result.correctAnswers}/{result.totalQuestions}
                  </div>
                  <div className="w-32">
                    <Progress
                      value={(result.correctAnswers / result.totalQuestions) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium">Time Taken:</span>{" "}
                  {calculateTimeTaken(result.startedAt, result.endedAt)}
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="font-medium">Correct Answers:</span>{" "}
                  {result.correctAnswers}
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <span className="font-medium">Accuracy:</span>{" "}
                  {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}