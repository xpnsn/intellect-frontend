import { MainLayout } from "@/layouts/MainLayout";
import { QuizForm } from "@/components/quiz/QuizForm";

export default function QuizCreatePage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>
        <QuizForm />
      </div>
    </MainLayout>
  );
}