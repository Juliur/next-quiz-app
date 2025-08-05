"use client";
import { useRouter } from "next/navigation";
import { useQuizContext } from "@/contexts/quizContext";
import { useEffect } from "react";
import Loader from "../loader/loader";

function CategorySelector() {
  const router = useRouter();

  const {
    categories,
    categoryId,
    questions,
    categoriesLoading,
    categoriesError,
    questionsLoading,
    setCategory,
  } = useQuizContext();

  useEffect(() => {
    if (categoryId && questions?.length > 0 && !questionsLoading) {
      router.push("/quiz");
    }
  }, [categoryId, questions, questionsLoading, router]);

  if (categoriesLoading) {
    return (
      <div className="grid place-items-center">
        <Loader />
      </div>
    );
  }

  if (categoriesError) {
    <div className="text-center text-lg mt-8">Categories loading error</div>;
  }

  return (
    <div className="flex">
      <div></div>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          Choose category:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center justify-center p-2 bg-indigo-400 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 ease-in-out text-center"
              onClick={() => {
                setCategory(category.id, category.name);
              }}
            >
              <span className="text-lg font-semibold">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySelector;
