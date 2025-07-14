import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/layouts/MainLayout";
import { QuizCard } from "@/components/quiz/QuizCard";
import { QuizService } from "@/services/quiz-service";
import { Quiz } from "@/types/quiz";
import { toast } from "sonner";
import { SearchIcon } from "lucide-react";

export default function ExplorePage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await QuizService.getExploreQuizzes();
      setQuizzes(data);
      setFilteredQuizzes(data);
    } catch (error) {
      toast.error("Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(query) || 
        quiz.description.toLowerCase().includes(query)
      );
      setFilteredQuizzes(filtered);
    }
  }, [searchQuery, quizzes]);
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Explore Quizzes</h1>
          <p className="text-muted-foreground">
            Discover and play quizzes created by others
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse">Loading quizzes...</div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Quizzes Found</h2>
          {searchQuery ? (
            <p className="text-muted-foreground mb-6">
              No quizzes match your search criteria. Try a different search term.
            </p>
          ) : (
            <p className="text-muted-foreground mb-6">
              There are no quizzes available yet. Be the first to create one!
            </p>
          )}
          <Button onClick={() => navigate('/quizzes/new')}>
            Create a Quiz
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map(quiz => (
            <div key={quiz.id} className="flex">
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}