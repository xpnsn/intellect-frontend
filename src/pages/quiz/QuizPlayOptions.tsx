import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ChevronLeftIcon, BookIcon, GlobeIcon, BrainIcon } from "lucide-react";

export default function QuizPlayOptions() {
  const navigate = useNavigate();
  const [customQuizId, setCustomQuizId] = useState("");
  
  const handlePlayById = () => {
    if (!customQuizId.trim()) {
      toast.error("Please enter a Quiz ID");
      return;
    }
    navigate(`/quizzes/${customQuizId}/play`);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => navigate('/')}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Play Quizzes</h1>
        
        <Tabs defaultValue="options" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="options">Play Options</TabsTrigger>
            <TabsTrigger value="explore">Explore Quizzes</TabsTrigger>
            <TabsTrigger value="my">My Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="options" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="flex items-center">
                    <BookIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Play by ID
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quizId">Quiz ID</Label>
                    <Input 
                      id="quizId" 
                      placeholder="Enter Quiz ID"
                      value={customQuizId}
                      onChange={(e) => setCustomQuizId(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter a specific Quiz ID to play that quiz directly.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handlePlayById}
                    disabled={!customQuizId.trim()}
                  >
                    Start Quiz
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="bg-purple-50 border-b">
                  <CardTitle className="flex items-center">
                    <BrainIcon className="h-5 w-5 mr-2 text-purple-600" />
                    AI Practice Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a personalized quiz using AI to test your knowledge on any topic.
                  </p>
                  <div className="bg-purple-50 p-3 rounded-lg text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Choose any topic you want to practice</li>
                      <li>Select difficulty level and question count</li>
                      <li>Get immediate feedback on your answers</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="secondary"
                    onClick={() => navigate('/play/ai')}
                  >
                    Create AI Quiz
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="explore">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GlobeIcon className="h-5 w-5 mr-2" />
                  Explore All Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Browse and play quizzes created by the community on various topics.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm">
                    Discover quizzes on different topics, from general knowledge to specialized subjects.
                    Find quizzes that match your interests and test your knowledge.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/explore')}
                >
                  Browse Quizzes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="my">
            <Card>
              <CardHeader>
                <CardTitle>My Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View and play quizzes that you've created.
                </p>
                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                  <p className="text-sm">
                    Access your personal quiz collection. Test your own quizzes or continue working on them
                    by adding more questions.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/quizzes')}
                >
                  View My Quizzes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}