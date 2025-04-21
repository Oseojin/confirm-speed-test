"use client";

import { useEffect, useState } from "react";

type Props = {
  token: string;
  nickname: string;
  onFinish: (score: number) => void;
};

export default function ConfirmGame({ token, nickname, onFinish }: Props) {
  const [buttonPos, setButtonPos] = useState({ top: 0, left: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // 전체 화면 기준으로 버튼 위치 생성
    setButtonPos({
      top: Math.random() * 80 + 5, // 5% ~ 85%
      left: Math.random() * 80 + 5, // 5% ~ 85%
    });
    setStartTime(performance.now());
  }, []);

  const handleClick = async () => {
    if (!startTime || clicked) return;
    setClicked(true);

    const score = Math.floor(performance.now() - startTime);
    onFinish(score);

    await fetch("/api/confirm-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nickname, score }),
    });
  };

  if (clicked) return null;

  return (
    <div className="fixed inset-0 bg-gray-100">
      <button
        onClick={handleClick}
        className="absolute bg-green-500 text-white px-4 py-2 rounded shadow"
        style={{
          top: `${buttonPos.top}%`,
          left: `${buttonPos.left}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        Confirm!
      </button>
    </div>
  );
}
