"use client";
import QuizOptionButton from "@/componets/quizOptionButton/quizOptionButton";
import { useQuizContext } from "@/contexts/quizContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizQuestionPage({
  params,
}: {
  params: { question: string };
}) {
  const questionIndex = parseInt(params.question) - 1;

  const { questions, answerCurrentQuestion } = useQuizContext();
  const router = useRouter();
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    if (!currentQuestion) return;

    const answers = [
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers,
    ];

    const shuffled = answers
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setShuffledAnswers(shuffled);
  }, [currentQuestion]);

  const handleNext = () => {
    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex < questions.length) {
        router.push(`/quiz/${nextIndex + 1}`);
      } else {
        router.push("/result");
      }
    }, 1500);
  };

  const handleClick = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    answerCurrentQuestion(answer);
    handleNext();
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-xl mx-auto shadow-md bg-eggplant rounded-sm p-8">
      <div className="text-sm text-white-600">
        Question {questionIndex + 1} / {questions.length}
      </div>
      <p className="text-lg mb-6">{currentQuestion.question}</p>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {shuffledAnswers.map((answer) => (
          <QuizOptionButton
            key={`key_${answer}`}
            answer={answer}
            isCorrect={
              selectedAnswer !== null &&
              answer === currentQuestion.correct_answer
            }
            isSelected={answer === selectedAnswer}
            onClick={() => {
              handleClick(answer);
            }}
          />
        ))}
      </div>
    </div>
  );
}
