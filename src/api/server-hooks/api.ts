import { getApiUrl } from "@/lib/utils";
import { getLocale } from "next-intl/server";
import type { ZodSchema } from "zod";

export async function fetchWithLocale(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const locale = await getLocale();
  return await fetch(input, {
    method: "GET",
    cache: "force-cache",
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-lang": locale,
      ...init?.headers,
    },
  });
}

export async function fetchStatic<T>(
  input: string,
  schema: ZodSchema<T>,
  extra?: {
    tags?: NextFetchRequestConfig["tags"];
    init?: RequestInit;
  },
) {
  const res = await fetchWithLocale(getApiUrl(input), {
    ...extra?.init,
    next: {
      tags: extra?.tags,
    },
  });
  const data = await res.json();
  console.log(`[FETCH STATIC] ${res.url}: `, data);
  const validatedData = schema.safeParse(data);
  if (!validatedData.success)
    throw new Error(JSON.stringify(validatedData.error.issues));
  return validatedData.data;
}
