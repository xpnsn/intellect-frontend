import { useParams } from 'react-router-dom';
import { MainLayout } from "@/layouts/MainLayout";
import { QuizResults } from "@/components/quiz/QuizResults";

export default function ResultsPage() {
  const { quizId } = useParams<{ quizId?: string }>();
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {quizId ? "Quiz Results" : "My Results"}
        </h1>
        <QuizResults quizId={quizId} />
      </div>
    </MainLayout>
  );
}