import { getAuthenticatedApiClient } from './api';
import { 
  Quiz, 
  QuizCreationRequest, 
  Question, 
  QuestionCreationRequest, 
  QuizStartRequest, 
  QuestionResponse,
  QuizResult
} from '@/types/quiz';

export const QuizService = {
  // Quiz Management
  async createQuiz(data: QuizCreationRequest): Promise<Quiz> {
    const response = await getAuthenticatedApiClient().post('/quiz', data);
    return response.data;
  },
  
  async getQuizzes(): Promise<Quiz[]> {
    const response = await getAuthenticatedApiClient().get('/quiz');
    return response.data;
  },
  
  async getExploreQuizzes(): Promise<Quiz[]> {
    const response = await getAuthenticatedApiClient().get('/quiz/explore');
    return response.data;
  },
  
  async getQuiz(id: string): Promise<Quiz> {
    const response = await getAuthenticatedApiClient().get(`/quiz/${id}`);
    return response.data;
  },
  
  async deleteQuiz(id: string): Promise<void> {
    await getAuthenticatedApiClient().delete(`/api/quizzes/${id}`);
  },
  
  // Question Management
  async addQuestion(data: QuestionCreationRequest): Promise<Question> {
    const response = await getAuthenticatedApiClient().post('/question', data);
    return response.data;
  },
  
  async getQuizQuestions(quizId: string): Promise<Question[]> {
    const response = await getAuthenticatedApiClient().get(`/question/quiz/${quizId}`);
    return response.data;
  },
  
  async deleteQuestion(id: string): Promise<void> {
    await getAuthenticatedApiClient().delete(`/api/questions/${id}`);
  },
  
  // Quiz Playing
  async startQuiz(data: QuizStartRequest): Promise<Question[]> {
    const response = await getAuthenticatedApiClient().post('/api/quizzes/start', data);
    return response.data;
  },
  
  async submitAnswer(questionId: string, data: QuestionResponse): Promise<void> {
    await getAuthenticatedApiClient().post(`/api/questions/${questionId}/answer`, data);
  },
  
  async finishQuiz(quizId: string): Promise<QuizResult> {
    const response = await getAuthenticatedApiClient().post(`/api/quizzes/${quizId}/finish`);
    return response.data;
  },
  
  // Quiz Results
  async getQuizResults(quizId?: string): Promise<QuizResult[]> {
    const url = quizId ? `/api/results?quizId=${quizId}` : '/api/results';
    const response = await getAuthenticatedApiClient().get(url);
    return response.data;
  },

  // Get results by result ID list
  async getResultsByIds(resultIds: string[]): Promise<QuizResult[]> {
    if (!resultIds || resultIds.length === 0) {
      return [];
    }
    const response = await getAuthenticatedApiClient().post('/api/results/batch', { resultIds });
    return response.data;
  }
};