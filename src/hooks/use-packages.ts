"use client";
import { useEffect, useState } from "react";
import { fetchStaticClient } from "@/api/hooks/api";
import { packagesSchemas } from "@/schemas/package";

type Feature = {
  name: string;
  included: boolean;
};
export type PackageType = {
  id: string;
  name: string;
  price: string;
  features: Feature[];
};

export function usePackages(locale: string) {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStaticClient(
          "/packages",
          packagesSchemas,
          ["packages"],
          // @ts-ignore
          locale,
        );
        setPackages(data);
      } catch (err) {
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, [locale]);

  return { packages, loading, error };
}
