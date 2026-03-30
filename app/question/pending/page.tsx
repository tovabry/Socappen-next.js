"use client";

import { useEffect, useState } from "react";

interface ResponseQuestion {
  id: number;
  nickname: string;
  text: string;
}

export default function PendingPage() {
  const [questions, setquestions] = useState<ResponseQuestion[]>([]);

useEffect(() => {
    fetch("http://localhost:8080/api/question/pending", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then((data: ResponseQuestion[]) => setquestions(data))
    .catch(err => console.error("Failed to fetch questions", err));
}, []);

  return (
    <div>
      <h1>Pending questions</h1>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <strong>{question.nickname}</strong>: {question.text}
          </li>
        ))}
      </ul>
    </div>
  );
}