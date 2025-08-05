"use client";
import { useQuizContext } from "@/contexts/quizContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CURRENT_QUESTION_INDEX } from "../constants/quiz";
import Loader from "@/componets/loader/loader";

export default function QuizRootPage() {
  const router = useRouter();
  const { questions } = useQuizContext();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!questions.length) {
      router.push("/");
      return;
    }

    const storedIndex = localStorage.getItem(CURRENT_QUESTION_INDEX);
    const index = storedIndex ? parseInt(storedIndex) : 0;

    if (index >= 0 && index < questions.length) {
      router.push(`/quiz/${index + 1}`);
    } else {
      router.push("/quiz/1");
    }

    setHasLoaded(true);
  }, [questions, router]);

  if (!hasLoaded) return <Loader />;
  return null;
}
