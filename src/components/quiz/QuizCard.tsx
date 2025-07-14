import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayIcon, PenIcon, FileQuestionIcon } from "lucide-react";
import { Quiz } from "@/types/quiz";

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{quiz.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{quiz.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50">
            {quiz.questionsCount || 0} Questions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Optional: Add more quiz details here if needed */}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/quizzes/${quiz.id}/questions`)}
          className="flex-1"
        >
          <FileQuestionIcon className="mr-2 h-4 w-4" />
          Manage Questions
        </Button>
        <Button 
          size="sm"
          onClick={() => navigate(`/quizzes/${quiz.id}/play`)}
          className="flex-1"
        >
          <PlayIcon className="mr-2 h-4 w-4" />
          Play Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}