"use client";

import { useEffect, useState } from "react";

interface ResponseFaq {
  id: number;
  question: string;
  answer: string;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<ResponseFaq[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/faq/all")
      .then(res => res.json())
      .then((data: ResponseFaq[]) => setFaqs(data))
      .catch(err => {
        console.error("Failed to fetch FAQs:", err);
        setFaqs([]);
      });
  }, []);

  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      <ul>
        {faqs.map(faq => (
          <li key={faq.id}>
            <strong>{faq.question}</strong>: {faq.answer}
          </li>
        ))}
      </ul>
    </div>
  );
}