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

  const loadRankings = async () => {
    try {
      const res = await fetch("/api/confirm-score");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Failed to load ranking", err);
    }
  };

  const loadMyRank = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/confirm-score?token=${token}`);
      const data = await res.json();
      if (typeof data.rank === "number") setRank(data.rank);
    } catch (err) {
      console.error("Failed to load user rank", err);
    }
  };

  useEffect(() => {
    loadRankings();
    loadMyRank();

    const interval = setInterval(() => {
      loadRankings();
      loadMyRank();
    }, 5000); // 5초

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 clear
  }, [myScore, token]);

  return (
    <div className="w-full max-w-[320px] p-6 bg-white text-gray-800 border rounded-xl shadow text-center">
      <h2 className="text-xl font-bold mb-2">🏆 Top 10 Fastest</h2>
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
