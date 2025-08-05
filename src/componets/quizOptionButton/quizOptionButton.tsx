interface IQuizOptionButton {
  answer: string;
  isCorrect: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function QuizOptionButton({
  answer,
  isCorrect,
  isSelected,
  onClick,
}: IQuizOptionButton) {
  let bgClass = "";

  if (isSelected) {
    bgClass = isCorrect ? "bg-green-600" : "bg-red-600";
  } else if (isCorrect) {
    bgClass = "bg-green-400";
  }

  return (
    <button
      className={`${bgClass} text-white font-semibold py-2 px-4 rounded-xl border border-white cursor-pointer`}
      onClick={onClick}
      disabled={isSelected}
    >
      {answer}
    </button>
  );
}

export default QuizOptionButton;
