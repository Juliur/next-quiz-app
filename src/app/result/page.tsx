"use client";
import { useQuizContext } from "@/contexts/quizContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResultPage() {
  const { score, questions, resetQuiz } = useQuizContext();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    resetQuiz();
  }, []);

  const handleRestart = () => {
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto p-8 rounded shadow-md text-center bg-eggplant">
      <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
      <p className="text-xl mb-6">
        Your score: <span className="font-semibold">{score}</span> out of{" "}
        {questions.length}
      </p>
      <button
        onClick={handleRestart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
      >
        Restart Quiz
      </button>
    </div>
  );
}
