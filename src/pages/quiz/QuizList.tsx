import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { QuizCard } from "@/components/quiz/QuizCard";
import { QuizService } from "@/services/quiz-service";
import { Quiz } from "@/types/quiz";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
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

export default function QuizListPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await QuizService.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      toast.error("Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  const handleDeleteQuiz = async (quizId: string) => {
    try {
      setDeletingId(quizId);
      await QuizService.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error("Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-muted-foreground">
            Manage your quizzes and questions
          </p>
        </div>
        <Button onClick={() => navigate('/quizzes/new')} className="flex-shrink-0">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Quiz
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse">Loading quizzes...</div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Quizzes Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any quizzes yet. Create your first quiz to get started!
          </p>
          <Button onClick={() => navigate('/quizzes/new')}>
            Create Your First Quiz
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="flex">
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}