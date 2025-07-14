import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { QuestionForm } from "@/components/quiz/QuestionForm";
import { QuestionList } from "@/components/quiz/QuestionList";
import { QuizService } from "@/services/quiz-service";
import { Quiz } from "@/types/quiz";
import { toast } from "sonner";
import { ChevronLeftIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function QuestionManagementPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        navigate('/quizzes');
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await QuizService.getQuiz(quizId);
        setQuiz(data);
      } catch (error) {
        toast.error("Failed to load quiz details");
        navigate('/quizzes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId, navigate]);
  
  const handleQuestionAdded = () => {
    if (quiz) {
      setQuiz({
        ...quiz,
        questionsCount: (quiz.questionsCount || 0) + 1
      });
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="animate-pulse">Loading quiz details...</div>
        </div>
      </MainLayout>
    );
  }
  
  if (!quiz) {
    return null;
  }
  
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
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <p className="text-muted-foreground mt-1">{quiz.description}</p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Add New Question</h2>
        <QuestionForm quizId={quizId!} onQuestionAdded={handleQuestionAdded} />
        <QuestionList quizId={quizId!} />
      </div>
    </MainLayout>
  );
}