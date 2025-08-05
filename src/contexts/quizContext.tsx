"use client";
import { IQuizContext, IQuizContextProviderProps } from "@/contexts/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCategories } from "./hooks/useCategories";
import { useQuestions } from "./hooks/useQuestions";

const CATEGORY_ID_KEY = "quiz_category_id";
const CATEGORY_NAME_KEY = "quiz_category_name";

export const QuizContext = createContext<IQuizContext | undefined>(undefined);

export const QuizContextProvider = ({
  children,
}: IQuizContextProviderProps) => {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    questions,
    questionsLoading,
    questionsLoadingError,
    currentQuestionIndex,
    score,
    fetchQuestions,
    answerCurrentQuestion,
    setCurrentQuestionIndex,
    resetQuestions,
  } = useQuestions();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedCategoryId = localStorage.getItem(CATEGORY_ID_KEY);
    const storedCategoryName = localStorage.getItem(CATEGORY_NAME_KEY);

    if (storedCategoryId && storedCategoryName) {
      setCategoryId(parseInt(storedCategoryId));
      setCategoryName(storedCategoryName);
      fetchQuestions(parseInt(storedCategoryId));
    }
  }, []);

  const resetQuiz = () => {
    resetQuestions();
    setCategoryId(null);
    setCategoryName(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CATEGORY_ID_KEY);
      localStorage.removeItem(CATEGORY_NAME_KEY);
    }
  };

  const setCategory = (id: number, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem(CATEGORY_ID_KEY, `${id}`);
      localStorage.setItem(CATEGORY_NAME_KEY, name);
    }
    fetchQuestions(id);
  };

  const value: IQuizContext = useMemo(
    () => ({
      categories,
      categoriesLoading,
      categoriesError,
      categoryId,
      categoryName,

      questions,
      questionsLoading,
      questionsLoadingError,
      currentQuestionIndex,
      score,
      setCategory,
      answerCurrentQuestion,
      resetQuiz,
      setCurrentQuestionIndex,
    }),
    [
      categories,
      categoriesLoading,
      categoriesError,
      categoryId,
      categoryName,
      questions,
      currentQuestionIndex,
      score,
    ]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context)
    throw new Error("useQuizContext must be used within QuizProvider");
  return context;
};
