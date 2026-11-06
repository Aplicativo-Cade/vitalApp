import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Collection {
  id: string;
  name: string;
  created_at: string;
  items: { id: string; exercise_id: string }[];
}

export const collectionsKey = ["collections"];

export function useCollections() {
  return useQuery({
    queryKey: collectionsKey,
    queryFn: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from("collections")
        .select("id, name, created_at, items:collection_items(id, exercise_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Collection[];
    },
  });
}

export function useCollectionMutations() {
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries({ queryKey: collectionsKey });
  return {
    create: useMutation({
      mutationFn: async (name: string) => {
        const { data, error } = await supabase.from("collections").insert({ name }).select("id").single();
        if (error) throw error;
        return data.id as string;
      },
      onSuccess: done,
    }),
    rename: useMutation({
      mutationFn: async ({ id, name }: { id: string; name: string }) => {
        const { error } = await supabase.from("collections").update({ name }).eq("id", id);
        if (error) throw error;
      },
      onSuccess: done,
    }),
    remove: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("collections").delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: done,
    }),
    addItems: useMutation({
      mutationFn: async ({ collectionId, exerciseIds }: { collectionId: string; exerciseIds: string[] }) => {
        const { error } = await supabase
          .from("collection_items")
          .upsert(
            exerciseIds.map((exercise_id) => ({ collection_id: collectionId, exercise_id })),
            { onConflict: "collection_id,exercise_id", ignoreDuplicates: true },
          );
        if (error) throw error;
      },
      onSuccess: done,
    }),
    removeItem: useMutation({
      mutationFn: async ({ collectionId, exerciseId }: { collectionId: string; exerciseId: string }) => {
        const { error } = await supabase
          .from("collection_items")
          .delete()
          .eq("collection_id", collectionId)
          .eq("exercise_id", exerciseId);
        if (error) throw error;
      },
      onSuccess: done,
    }),
  };
}
