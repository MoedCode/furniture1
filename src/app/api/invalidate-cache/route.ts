import { type NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CACHE_INVALIDATION_SECRET;

  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tags } = await req.json();

    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
      return NextResponse.json({ error: "Invalid tag list" }, { status: 400 });
    }

    for (const tag of tags) revalidateTag(tag);

    return NextResponse.json({ success: true, revalidated: tags });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
