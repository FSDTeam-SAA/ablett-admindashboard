"use client";

import { useState } from "react";
import { X } from "lucide-react";

export type FaqPayload = {
  question: string;
  answer: string;
};

type FaqFormProps = {
  onDiscard: () => void;
  onSave: (payload: FaqPayload) => void;
  isSaving?: boolean;
};

export function FaqForm({ onDiscard, onSave, isSaving = false }: FaqFormProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          question: question.trim(),
          answer: answer.trim(),
        });
      }}
      className="rounded-lg bg-[#181818] p-5 text-white"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-medium leading-7 text-white">
          Add New FAQ
        </h2>
        <button
          type="button"
          onClick={onDiscard}
          disabled={isSaving}
          className="text-[#8a8a8a] transition-colors hover:text-white"
          aria-label="Close FAQ form"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="faq-question"
            className="text-base font-medium text-white"
          >
            Question
          </label>
          <input
            id="faq-question"
            type="text"
            placeholder="Enter Question Title"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={isSaving}
            className="h-[44px] w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="faq-answer"
            className="text-base font-medium text-white"
          >
            Answer
          </label>
          <textarea
            id="faq-answer"
            placeholder="Write your Answer here ..."
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            disabled={isSaving}
            className="min-h-[190px] w-full resize-none rounded border border-[#747474] bg-transparent px-4 py-4 text-sm leading-5 text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            required
          />
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onDiscard}
          disabled={isSaving}
          className="h-10 rounded-full bg-[#5a5a5a] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#686868]"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 rounded-full bg-[#c98313] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f]"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
