import { useEffect, useState } from "react";
import { IQuestion } from "../types";
import {
  CURRENT_QUESTION_INDEX,
  SCORE_KEY,
  QUESTIONS_STORAGE_KEY,
} from "@/app/constants/quiz";

export function useQuestions() {
  const [questions, setQuestionsState] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsLoadingError, setQuestionsLoadingError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    const savedScore = localStorage.getItem(SCORE_KEY);
    const savedIndex = localStorage.getItem(CURRENT_QUESTION_INDEX);

    if (savedQuestions) setQuestionsState(JSON.parse(savedQuestions));
    if (savedScore) setScore(parseInt(savedScore));
    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex));
  }, []);

  useEffect(() => {
    const scoreData = localStorage.getItem(SCORE_KEY);
    if (scoreData) {
      setScore(parseInt(scoreData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, `${score}`);
  }, [score]);

  useEffect(() => {
    localStorage.setItem(CURRENT_QUESTION_INDEX, `${currentQuestionIndex}`);
  }, [currentQuestionIndex]);

  const fetchQuestions = async (categoryId: number) => {
    setQuestionsLoading(true);
    setQuestionsLoadingError(null);

    try {
      const questionsCachedData = localStorage.getItem(QUESTIONS_STORAGE_KEY);

      if (questionsCachedData) {
        setQuestions(JSON.parse(questionsCachedData));
        return;
      }

      const response = await fetch(`/api/get-questions?category=${categoryId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to load questions:", err);
      if (err instanceof Error) {
        setQuestionsLoadingError(err.message);
      } else {
        setQuestionsLoadingError("Unknown error");
      }
    } finally {
      setQuestionsLoading(false);
    }
  };

  const setQuestions = (q: IQuestion[]) => {
    setQuestionsState(q);
    setCurrentQuestionIndex(0);
    saveQuestionsToStorage(q);
  };

  const saveQuestionsToStorage = (q: IQuestion[]) => {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(q));
  };

  const removeQuestionsFromStorage = () => {
    localStorage.removeItem(QUESTIONS_STORAGE_KEY);
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const answerCurrentQuestion = (selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 3000);
  };

  const resetQuestions = () => {
    setQuestionsState([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    removeQuestionsFromStorage();
  };

  return {
    questions,
    questionsLoading,
    questionsLoadingError,
    currentQuestionIndex,
    score,
    fetchQuestions,
    setQuestions,
    answerCurrentQuestion,
    setCurrentQuestionIndex,
    resetQuestions,
  };
}
