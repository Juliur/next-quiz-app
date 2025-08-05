import { NextResponse } from "next/server";
import { decode } from "html-entities";

function decodeHtmlEntities(str: string) {
  return decode(str);
}

interface TriviaAnswer {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
const API_BASE_URL = process.env.NEXT_PUBLIC_OPENTDB_API_BASE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get("amount") || 10;
  const category = searchParams.get("category");

  const triviaApiUrl = `${API_BASE_URL}/api.php?amount=${amount}&category=${category}`;

  try {
    const response = await fetch(triviaApiUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      return NextResponse.json(
        { error: "Failed to fetch trivia questions", code: data.response_code },
        { status: 400 }
      );
    }

    const decodedQuizQuestions = data.results.map((q: TriviaAnswer) => ({
      ...q,
      question: decodeHtmlEntities(q.question),
      correct_answer: decodeHtmlEntities(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map((ans) =>
        decodeHtmlEntities(ans)
      ),
    }));
    return NextResponse.json(decodedQuizQuestions);
  } catch (error) {
    console.error("Error fetching trivia:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
