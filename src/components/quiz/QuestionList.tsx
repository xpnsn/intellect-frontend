import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Question } from "@/types/quiz";
import { QuizService } from "@/services/quiz-service";
import { Trash2Icon } from "lucide-react";
import { ApiError } from "@/types/error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionListProps {
  quizId: string;
}

export function QuestionList({ quizId }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await QuizService.getQuizQuestions(quizId);
      setQuestions(data);
    } catch (error) {
      toast.error("Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setDeletingId(questionId);
      await QuizService.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Failed to delete question");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Loading questions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Questions ({questions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No questions added yet. Start adding questions using the form above.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {index + 1}. {question.title}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {question.options.map((option, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 border rounded-full text-xs">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={option === question.correctAnswer ? "font-medium text-green-600" : ""}>
                            {option}
                            {option === question.correctAnswer && " (Correct)"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Question</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this question? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={deletingId === question.id}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                          {deletingId === question.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}