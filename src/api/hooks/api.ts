import { getApiUrl } from "@/lib/utils";
import type { ZodSchema } from "zod";

export async function fetchWithLocale(
  input: RequestInfo | URL,
  extra: {
    init?: RequestInit;
    locale: "ar" | "en";
  },
) {
  return await fetch(input, {
    method: "GET",
    cache: "force-cache",
    ...extra.init,
    headers: {
      "Content-Type": "application/json",
      "X-LANG": extra.locale,
      ...extra.init?.headers,
    },
  });
}

export async function fetchWithoutAuth<T>(
  input: string,
  schema: ZodSchema<T>,
  extra?: {
    tags?: NextFetchRequestConfig["tags"];
    init?: RequestInit;
  },
) {
  if (typeof window === "undefined")
    throw new Error("Cannot use fetch outside browser");

  const data = await fetch(getApiUrl(input), {
    ...extra?.init,
    headers: {
      "Content-Type": "application/json",
      ...extra?.init?.headers,
    },
    next: {
      tags: extra?.tags,
    },
  });
  console.log("[FETCH BROWSER]: ", data);
  const validatedData = schema.safeParse(await data.json());
  if (!validatedData.success) throw new Error("Failed to fetch data");
  return validatedData.data;
}

export async function fetchWithAuth<T>(
  input: string,
  schema: ZodSchema<T>,
  extra?: {
    tags?: NextFetchRequestConfig["tags"];
    init?: RequestInit;
  },
) {
  if (typeof window === "undefined")
    throw new Error("Cannot use fetch outside browser");

  const authToken = localStorage.getItem("token");
  if (!authToken)
    throw new Error("Can't use fetchWithAuth when the user is not logged in.");

  const data = await fetch(getApiUrl(input), {
    ...extra?.init,
    headers: {
      ...extra?.init?.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    next: {
      tags: extra?.tags,
    },
  });
  console.log("[FETCH BROWSER]: ", data);
  const validatedData = schema.safeParse(await data.json());
  if (!validatedData.success) throw new Error("Failed to fetch data");
  return validatedData.data;
}

export async function fetchMediaWithAuth<T>(
  input: string,
  schema: ZodSchema<T>,
  extra?: {
    tags?: NextFetchRequestConfig["tags"];
    init?: RequestInit;
  },
) {
  if (typeof window === "undefined")
    throw new Error("Cannot use fetch outside browser");

  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");


  const data = await fetch(getApiUrl(input), {
    ...extra?.init,
    headers: {
      ...extra?.init?.headers,
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: extra?.tags,
    },
  });
  console.log("[FETCH BROWSER]: ", data);
  const validatedData = schema.safeParse(await data.json());
  if (!validatedData.success) throw new Error("Failed to fetch data");
  return validatedData.data;
}

export async function fetchStaticClient<T>(
  input: string,
  schema: ZodSchema<T>,
  tags?: NextFetchRequestConfig["tags"],
  locale?: "ar" | "en",
) {
  if (typeof window === "undefined")
    throw new Error("Cannot use fetchStatic outside browser");
  const data = await fetchWithLocale(getApiUrl(input), {
    locale: locale || "en",
    init: {
      next: {
        tags: tags,
      },
    },
  });
  console.log("[FETCH STATIC]: ", data);
  const validatedData = schema.safeParse(await data.json());
  if (!validatedData.success) throw new Error("Failed to fetch static data");
  return validatedData.data;
}
