import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { QuizService } from "@/services/quiz-service";
import { TrashIcon, PlusIcon } from 'lucide-react';
import { ApiError } from "@/types/error";

interface QuestionFormProps {
  quizId: string;
  onQuestionAdded?: () => void;
}

const questionFormSchema = z.object({
  title: z.string().min(5, "Question title must be at least 5 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Please select the correct answer"),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

export function QuestionForm({ quizId, onQuestionAdded }: QuestionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      title: "",
      options: ["", ""],
      correctAnswer: "",
    },
  });
  
  const { fields, append, remove } = form.watch();
  const options = form.watch("options");
  
  const onSubmit = async (values: QuestionFormValues) => {
    try {
      setIsLoading(true);
      await QuizService.addQuestion({
        ...values,
        quizId,
      });
      toast.success("Question added successfully!");
      
      form.reset({
        title: "",
        options: ["", ""],
        correctAnswer: "",
      });
      
      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to add question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const addOption = () => {
    const currentOptions = form.getValues("options");
    form.setValue("options", [...currentOptions, ""]);
  };
  
  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options");
    const correctAnswer = form.getValues("correctAnswer");
    
    if (currentOptions.length <= 2) {
      toast.error("You need at least two options");
      return;
    }
    
    // If removing the correct answer, reset the selection
    if (correctAnswer === currentOptions[index]) {
      form.setValue("correctAnswer", "");
    }
    
    form.setValue("options", currentOptions.filter((_, i) => i !== index));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Question</CardTitle>
        <CardDescription>Create a new question for your quiz</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your question" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Options</FormLabel>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder={`Option ${index + 1}`} 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeOption(index)}
                    disabled={isLoading || options.length <= 2}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addOption}
                disabled={isLoading}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                      disabled={isLoading}
                    >
                      {options.map((option, index) => (
                        <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option} disabled={!option} />
                          </FormControl>
                          <FormLabel className="font-normal">{option || `Option ${index + 1}`}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading || options.some(o => !o)}>
                {isLoading ? "Adding..." : "Add Question"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}