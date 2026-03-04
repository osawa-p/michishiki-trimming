"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  text: string;
};

export default function ExpandableReviewText({ text }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      // Check if the text overflows the 3-line clamp
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [text]);

  return (
    <div>
      <p
        ref={textRef}
        className={`text-sm text-gray-700 leading-relaxed ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>
      {isClamped && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-sm text-blue-600 hover:text-blue-800 mt-1 font-medium"
        >
          もっと見る
        </button>
      )}
    </div>
  );
}
