import { NextResponse } from "next/server";

import { getAppNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getAppNotifications();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
