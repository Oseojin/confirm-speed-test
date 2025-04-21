import { decodeDeviceId } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, nickname, score } = await req.json();

    const deviceId = decodeDeviceId(token);
    if (
      !deviceId ||
      typeof nickname !== "string" ||
      typeof score !== "number"
    ) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const existing = await prisma.confirmRecord.findUnique({
      where: { deviceId },
    });

    let result;
    if (existing) {
      if (score < existing.scoreMs) {
        result = await prisma.confirmRecord.update({
          where: { deviceId },
          data: {
            scoreMs: score,
            nickname,
          },
        });
      } else {
        result = existing;
      }
    } else {
      result = await prisma.confirmRecord.create({
        data: {
          deviceId,
          nickname,
          scoreMs: score,
        },
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/confirm-score error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (token) {
      const deviceId = decodeDeviceId(token);
      if (!deviceId) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      const record = await prisma.confirmRecord.findUnique({
        where: { deviceId },
      });

      if (!record) {
        return NextResponse.json({ score: null, rank: null });
      }

      const count = await prisma.confirmRecord.count({
        where: {
          scoreMs: {
            lt: record.scoreMs, // 낮을수록 높은 순위
          },
        },
      });

      return NextResponse.json({
        score: record.scoreMs,
        rank: count + 1,
      });
    }

    // top 10
    const top10 = await prisma.confirmRecord.findMany({
      orderBy: { scoreMs: "asc" },
      take: 10,
      select: {
        nickname: true,
        scoreMs: true,
        createdAt: true,
      },
    });

    return NextResponse.json(top10);
  } catch (error) {
    console.error("GET /api/confirm-score error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
