"use client";

import { X } from "lucide-react";

type Faq = {
  id: number;
  question: string;
  answer: string;
};

type EditFaqFormProps = {
  faq: Faq;
  onDiscard: () => void;
  onSave: (faq: Faq) => void;
};

export function EditFaqForm({ faq, onDiscard, onSave }: EditFaqFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        onSave({
          id: faq.id,
          question: String(formData.get("question") ?? ""),
          answer: String(formData.get("answer") ?? ""),
        });
      }}
      className="rounded-lg bg-[#181818] p-5 text-white"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-medium leading-7 text-white">Edit FAQ</h2>
        <button
          type="button"
          onClick={onDiscard}
          className="text-[#8a8a8a] transition-colors hover:text-white"
          aria-label="Close edit FAQ form"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="edit-faq-question"
            className="text-base font-medium text-white"
          >
            Question
          </label>
          <input
            id="edit-faq-question"
            name="question"
            type="text"
            defaultValue={faq.question}
            className="h-[44px] w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-faq-answer"
            className="text-base font-medium text-white"
          >
            Answer
          </label>
          <textarea
            id="edit-faq-answer"
            name="answer"
            defaultValue={faq.answer}
            className="min-h-[190px] w-full resize-none rounded border border-[#747474] bg-transparent px-4 py-4 text-sm leading-5 text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onDiscard}
          className="h-10 rounded-full bg-[#5a5a5a] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#686868]"
        >
          Discard
        </button>
        <button
          type="submit"
          className="h-10 rounded-full bg-[#c98313] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f]"
        >
          Save
        </button>
      </div>
    </form>
  );
}
