"use client";

import { useEffect, useState } from "react";

interface ResponseQAndA {
  questionId: number;
  nickname: string;
  questionText: string;
  answerText: string | null;
}

export default function QuestionsWithAnswersPage() {
  const [questions, setQuestions] = useState<ResponseQAndA[]>([]);

useEffect(() => {
  fetch("http://localhost:8080/api/question/with-answers")
    .then(res => res.json())
    .then((data: ResponseQAndA[]) => {
      console.log(data);   // inspect returned data
      setQuestions(data);
    })
    .catch(err => {
      console.error("Failed to fetch questions", err);
      setQuestions([]);
    });
}, []);
  return (
    <div>
      <h1>Questions and Answers</h1>
      <ul>
        {questions.map(q => (
          <li key={q.questionId}>
            <p><strong>{q.nickname}</strong>: {q.questionText}</p>
            <p><em>Svar:</em> {q.answerText ?? "No answer yet"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}