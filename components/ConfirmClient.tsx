"use client";

import { useEffect, useState } from "react";
import ConfirmGame from "./ConfirmGame";
import RankingBoard from "./RankingBoard";

export default function ConfirmClient() {
  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [runId, setRunId] = useState(0); // 재시작을 위한 상태

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
    setNickname(params.get("nickname"));
  }, []);

  const handleTryAgain = () => {
    setReactionTime(null);
    setRunId((prev) => prev + 1); // 새로운 실행 ID로 리렌더링 유도
  };

  if (!token || !nickname) {
    return <p className="text-red-600">Missing token or nickname in URL</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
      {reactionTime === null ? (
        <ConfirmGame
          key={runId} // ← 리렌더링을 유도
          token={token}
          nickname={nickname}
          onFinish={setReactionTime}
        />
      ) : (
        <div className="text-center">
          <RankingBoard token={token} myScore={reactionTime} />
          <button
            onClick={handleTryAgain}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
