"use client";

import { useEffect, useState } from "react";

interface ResponseQAndA {
  questionId: number;
  nickname: string;
  questionText: string;
  answerText: string | null;
}

export default function QuestionWithAnswerPage({ id }: { id: number }) {
  const [question, setQuestion] = useState<ResponseQAndA | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/questions/${id}/with-answer`)
      .then(res => res.json())
      .then((data: ResponseQAndA) => setQuestion(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h2>{question.nickname}</h2>
      <p>{question.questionText}</p>
      <p><strong>Svar:</strong> {question.answerText ?? "No answer yet"}</p>
    </div>
  );
}