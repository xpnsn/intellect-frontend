import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthService } from "@/services/auth-service";
import { BookOpenIcon, BrainIcon, TrophyIcon } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to IntellectAI</h1>
          <p className="text-xl text-muted-foreground">
            Create, play, and practice with AI-powered quizzes!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Create Quizzes</h2>
            <p className="text-gray-600 mb-4">
              Make custom quizzes on any topic and share them with others.
            </p>
            <Button 
              className="mt-auto"
              onClick={() => navigate('/quizzes')}
            >
              My Quizzes
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center flex flex-col items-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <BrainIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Test Knowledge</h2>
            <p className="text-gray-600 mb-4">
              Challenge yourself with quizzes from various categories.
            </p>
            <Button 
              className="mt-auto"
              onClick={() => navigate('/play')}
            >
              Play Quizzes
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center flex flex-col items-center">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <TrophyIcon className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
            <p className="text-gray-600 mb-4">
              See your quiz results and track your improvement over time.
            </p>
            <Button 
              className="mt-auto" 
              onClick={() => navigate('/results')}
            >
              View Results
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to create your first quiz?</h2>
          <p className="text-muted-foreground mb-6">
            Get started by creating a new quiz and adding questions.
          </p>
          <Button size="lg" onClick={() => navigate('/quizzes/new')}>
            Create New Quiz
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}