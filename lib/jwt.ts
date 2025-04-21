import jwt from "jsonwebtoken";

const secret = process.env.DEVICE_JWT_SECRET!;

export function decodeDeviceId(token: string): string | null {
  try {
    const payload = jwt.verify(token, secret) as { deviceId: string };
    return payload.deviceId;
  } catch {
    return null;
  }
}
