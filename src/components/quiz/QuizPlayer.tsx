import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { QuizService } from "@/services/quiz-service";
import { Question, QuestionDto, QuizResult, AIQuizStartRequest, WebSocketMessage } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { ArrowRightIcon, CheckIcon, TimerIcon, WifiIcon } from "lucide-react";
import { webSocketService } from '@/services/websocket-service';

interface QuizPlayerProps {
  quizId?: string;
  aiQuizParams?: AIQuizStartRequest;
}

export function QuizPlayer({ quizId, aiQuizParams }: QuizPlayerProps) {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDto | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    const connectAndStartQuiz = async () => {
      try {
        setIsLoading(true);
        setConnectionStatus('connecting');
        
        // Connect to WebSocket
        await webSocketService.connect();
        setConnectionStatus('connected');
        
        // Subscribe to receive questions
        webSocketService.subscribe('quiz-player', handleWebSocketMessage);
        
        // Start appropriate quiz type
        if (quizId) {
          webSocketService.startRegularQuiz(quizId);
        } else if (aiQuizParams) {
          webSocketService.startAIQuiz(
            aiQuizParams.topic, 
            aiQuizParams.size,
            aiQuizParams.level
          );
        }
        
        setStartTime(new Date());
      } catch (error) {
        toast.error("Failed to connect to quiz server");
        setConnectionStatus('disconnected');
        navigate('/quizzes');
      } finally {
        setIsLoading(false);
      }
    };

    connectAndStartQuiz();
    
    // Cleanup on unmount
    return () => {
      webSocketService.unsubscribe('quiz-player');
      webSocketService.disconnect();
    };
  }, [quizId, aiQuizParams, navigate]);

  useEffect(() => {
    let timer: number;
    if (startTime && !quizResult) {
      timer = setInterval(() => {
        setTimeElapsed(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, quizResult]);

  const handleWebSocketMessage = (message: WebSocketMessage<unknown>) => {
    if (message.type === 'QUESTION') {
      setCurrentQuestion(message.payload as QuestionDto);
      setSelectedAnswer("");
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (message.type === 'RESULT') {
      setQuizResult(message.payload as QuizResult);
    }
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }

    try {
      setIsSubmitting(true);
      webSocketService.sendAnswer(selectedAnswer);
    } catch (error) {
      toast.error("Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px]">
        <div className="animate-pulse mb-4">Connecting to quiz server...</div>
        <WifiIcon className="animate-pulse h-6 w-6" />
      </div>
    );
  }

  if (quizResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium">Score</div>
              <div className="text-3xl font-bold mt-2">
                {quizResult.correctAnswers} / {quizResult.totalQuestions}
              </div>
              <Progress 
                value={(quizResult.correctAnswers / quizResult.totalQuestions) * 100} 
                className="h-2 mt-2" 
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium">Time Taken</div>
              <div className="text-3xl font-bold mt-2 flex items-center">
                <TimerIcon className="mr-2 h-6 w-6" />
                {formatTime(timeElapsed)}
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium mb-2">
              {quizResult.correctAnswers === quizResult.totalQuestions 
                ? "Perfect Score! 🎉" 
                : quizResult.correctAnswers > quizResult.totalQuestions / 2 
                  ? "Good Job! 👍" 
                  : "Keep Practicing! 💪"
              }
            </h3>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
          {quizId && (
            <Button onClick={() => navigate(`/quizzes/${quizId}/results`)}>
              View Detailed Results
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px]">
        <div className="mb-4">Waiting for first question...</div>
        <WifiIcon className="animate-pulse h-6 w-6" />
        <div className="text-sm text-muted-foreground mt-2">
          Connection status: {connectionStatus}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="relative pb-0">
        <div className="absolute top-4 right-4 flex items-center text-sm text-muted-foreground">
          <TimerIcon className="h-4 w-4 mr-1" />
          {formatTime(timeElapsed)}
        </div>
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex}
            {questionCount > 0 ? ` of ${questionCount}` : ''}
          </span>
          {questionCount > 0 && (
            <Progress value={(currentQuestionIndex / questionCount) * 100} className="h-2 mt-1" />
          )}
        </div>
        <CardTitle className="text-xl mt-4">{currentQuestion.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 border rounded-lg p-3 transition-colors ${
                selectedAnswer === option ? "border-primary bg-primary/5" : "hover:bg-muted"
              }`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer py-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <WifiIcon className={`h-4 w-4 mr-1 ${connectionStatus === 'connected' ? 'text-green-500' : 'text-amber-500'}`} />
            <span className="text-xs text-muted-foreground">
              {connectionStatus === 'connected' ? 'Connected' : 'Reconnecting...'}
            </span>
          </div>
          <Button 
            onClick={handleNext} 
            disabled={!selectedAnswer || isSubmitting || connectionStatus !== 'connected'}
          >
            {isSubmitting ? "Submitting..." : (
              <>
                Next <ArrowRightIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}