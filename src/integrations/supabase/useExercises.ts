// src/lib/useExercises.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase/client";
import type { Exercise } from "@/lib/exercises";

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      // Forçamos o tipo na query do Supabase caso o schema ainda não tenha sido regenerado
      const { data, error } = await (supabase as any)
        .from("exercises")
        .select("*");

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []) as Exercise[];
    },
  });
}