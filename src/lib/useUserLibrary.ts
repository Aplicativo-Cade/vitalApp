
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import type { Exercise } from "@/lib/exercises";

export interface Tome {
  id: string;
  title: string;
}

interface UserLibrary {
  exercises: Exercise[];
  tomes: Tome[];
}

export function useUserLibrary(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-library", userId],

    enabled: !!userId,

    queryFn: async (): Promise<UserLibrary> => {
      if (!userId) {
        return { exercises: [], tomes: [] };
      }

      // 1. Descobre quais tomos foram liberados para este usuário
      const { data: modules, error: modulesError } = await supabase
        .from("user_modules")
        .select("tome_id")
        .eq("user_id", userId);

      if (modulesError) throw modulesError;

      const tomeIds = [...new Set((modules ?? []).map((item) => item.tome_id))];

      // Usuário sem nenhum tomo liberado
      if (tomeIds.length === 0) {
        return { exercises: [], tomes: [] };
      }

      // 2. Busca os tomos liberados e seus exercícios
      const [tomesResult, exercisesResult] = await Promise.all([
        supabase
          .from("tomes")
          .select("id, title")
          .in("id", tomeIds)
          .order("title"),

        supabase
          .from("exercises")
          .select("*")
          .in("tome_id", tomeIds),
      ]);

      if (tomesResult.error) throw tomesResult.error;
      if (exercisesResult.error) throw exercisesResult.error;

      return {
        tomes: (tomesResult.data ?? []) as Tome[],
        exercises: (exercisesResult.data ?? []) as Exercise[],
      };
    },
  });
}
