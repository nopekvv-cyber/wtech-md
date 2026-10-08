"use client";
import { useLocale } from "next-intl";
import { useState } from "react";
import { BundleShell } from "@/components/ui/BundleShell";
import { useBrand } from "@/components/preloader/BrandContext";
const content = {
  ro: {
    title: "Întreabă orice",
    intro:
      "Ai o întrebare despre serviciile WTECH? AI-ul folosește informațiile publice aprobate.",
    label: "Întrebarea ta",
    send: "Trimite întrebarea",
    loading: "Pregătim răspunsul…",
    ai: "Răspuns AI",
    fallback:
      "AI nu este disponibil momentan. Consultă FAQ-ul sau continuă în formular.",
    continue: "Continuă în formular",
  },
  ru: {
    title: "Задайте вопрос",
    intro:
      "Вопрос об услугах WTECH? AI использует утверждённую публичную информацию.",
    label: "Ваш вопрос",
    send: "Отправить вопрос",
    loading: "Готовим ответ…",
    ai: "Ответ AI",
    fallback:
      "AI сейчас недоступен. Посмотрите FAQ или продолжите через форму.",
    continue: "Продолжить в форме",
  },
  en: {
    title: "Ask anything",
    intro:
      "A question about WTECH services? AI uses approved public information.",
    label: "Your question",
    send: "Send question",
    loading: "Preparing an answer…",
    ai: "AI answer",
    fallback:
      "AI is unavailable right now. Use the FAQ or continue through the form.",
    continue: "Continue in the form",
  },
};
export function AskAnything() {
  const locale = useLocale() as keyof typeof content;
  const c = content[locale];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle");
  const { openBooking } = useBrand();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setAnswer("");
    try {
      const r = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: AbortSignal.timeout(50000),
      });
      const d = await r.json();
      if (!r.ok || d.source !== "ai") throw Error();
      setAnswer(d.answer);
      setStatus("ai");
    } catch {
      setStatus("error");
    }
  }
  return (
    <section id="intreaba" className="section pt-0" aria-labelledby="ask-title">
      <div className="container-x">
        <BundleShell accent="violet" className="p-7 md:p-12">
          <h2 id="ask-title" className="text-[32px] md:text-[42px]">
            {c.title}
          </h2>
          <p className="text-dim mt-4 max-w-[640px]">{c.intro}</p>
          <form onSubmit={submit} className="mt-7 grid gap-4 max-w-[760px]">
            <label className="label" htmlFor="wtech-question">
              {c.label}
            </label>
            <textarea
              id="wtech-question"
              className="field"
              rows={3}
              required
              minLength={3}
              maxLength={800}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              className="btn btn-primary justify-self-start"
              disabled={status === "loading"}
            >
              {status === "loading" ? c.loading : c.send}
            </button>
          </form>
          <div
            aria-live="polite"
            aria-busy={status === "loading"}
            className="mt-6 max-w-[760px]"
          >
            {status === "loading" ? <p>{c.loading}</p> : null}
            {status === "ai" ? (
              <>
                <strong>{c.ai}</strong>
                <p className="whitespace-pre-wrap mt-3 leading-relaxed">
                  {answer}
                </p>
              </>
            ) : null}
            {status === "error" ? (
              <p role="alert" className="error-text">
                {c.fallback}
              </p>
            ) : null}
          </div>
          {question.trim() ? (
            <button
              className="btn btn-ghost mt-6"
              onClick={() => openBooking({ message: question })}
            >
              {c.continue}
            </button>
          ) : null}
        </BundleShell>
      </div>
    </section>
  );
}
