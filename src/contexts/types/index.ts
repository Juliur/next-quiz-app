import { ReactNode } from "react";

export interface IQuizContext {
  categories: ICategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;

  categoryId: number | null;
  categoryName: string | null;

  questions: IQuestion[];
  questionsLoading: boolean;
  questionsLoadingError: string | null;
  currentQuestionIndex: number;
  score: number;

  setCurrentQuestionIndex: (index: number) => void;
  setCategory: (id: number, name: string) => void;
  answerCurrentQuestion: (answer: string) => void;
  resetQuiz: () => void;
}

export interface IQuizContextProviderProps {
  children: ReactNode;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
