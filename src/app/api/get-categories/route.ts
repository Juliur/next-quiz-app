import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_OPENTDB_API_BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api_category.php`);

    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.trivia_categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
