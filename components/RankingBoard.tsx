"use client";

import { useEffect, useState } from "react";

type Record = {
  nickname: string;
  scoreMs: number;
  createdAt: string;
};

type Props = {
  token: string;
  myScore: number | null;
};

export default function RankingBoard({ token, myScore }: Props) {
  const [records, setRecords] = useState<Record[]>([]);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    // TOP 10 가져오기
    fetch("/api/confirm-score")
      .then((res) => res.json())
      .then(setRecords)
      .catch((err) => console.error("Failed to load ranking", err));

    // 내 점수로 랭킹 가져오기
    if (token) {
      fetch(`/api/confirm-score?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.rank === "number") setRank(data.rank);
        })
        .catch((err) => console.error("Failed to load user rank", err));
    }
  }, [myScore, token]);

  return (
    <div className="w-full max-w-[320px] p-6 bg-white text-gray-800 border rounded-xl shadow text-center">
      <h2 className="text-xl font-bold mb-2">🏆 Top 10 Rankings</h2>
      <ul className="space-y-1 text-sm mb-4">
        {records.map((r, idx) => (
          <li key={idx}>
            {idx + 1}. <strong>{r.nickname}</strong> — {r.scoreMs}ms
          </li>
        ))}
      </ul>

      {myScore !== null && (
        <div className="text-sm text-gray-700 border-t pt-2">
          <p>
            Your score: <strong>{myScore}ms</strong>
          </p>
          {rank && (
            <p>
              Your rank: <strong>#{rank}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
