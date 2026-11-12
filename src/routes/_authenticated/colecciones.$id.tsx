
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Trash2, Printer } from "lucide-react";
import { toast } from "sonner";
import { useCollections, useCollectionMutations } from "@/lib/collections";
import { useExercises } from "@/integrations/supabase/useExercises";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/colecciones/$id")({
  head: () => ({
    meta: [
      { title: "Colección — Vital" },
      { name: "description", content: "Ejercicios guardados en tu colección." },
      { property: "og:title", content: "Colección — Vital" },
      { property: "og:description", content: "Ejercicios guardados en tu colección." },
    ],
  }),
  component: CollectionDetail,
});

function CollectionDetail() {
  const { id } = Route.useParams();

  const { data, isLoading: isCollectionsLoading } = useCollections();

  const {
    data: exercises = [],
    isLoading: isExercisesLoading,
  } = useExercises();

  const { removeItem } = useCollectionMutations();

  const [del, setDel] = useState<string | null>(null);

  const col = data?.find((c) => c.id === id);

  // Índice dos exercícios para localizar cada exercício pelo ID.
  const exerciseById = new Map(
    exercises.map((exercise) => [exercise.id, exercise])
  );

  const isLoading = isCollectionsLoading || isExercisesLoading;

  return (
    <div className="px-5">
      <div className="mt-4 flex items-center justify-between">
        <Link
          to="/colecciones"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Colecciones
        </Link>

        <div className="no-print sticky bottom-24 z-20 mt-8 flex gap-2 px-6 lg:bottom-1">
          <Button
            variant="print"
            size="lg"
            className="h-12"
            onClick={() => window.print()}
          >
            <Printer /> PDF
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="mt-4 h-10 w-2/3" />
      ) : (
        <>
          <h1 className="fade-up mt-4 text-4xl">
            {col?.name ?? "Colección no encontrada"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {col?.items.length ?? 0} ejercicios
          </p>
        </>
      )}

      <ul className="mt-8 space-y-3">
        {isLoading &&
          [0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}

        {!isLoading && col?.items.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Esta colección está vacía.
          </p>
        )}

        {!isLoading &&
          col?.items.map((it, i) => {
            const ex = exerciseById.get(it.exercise_id);

            if (!ex) return null;

            return (
              <li
                key={it.id}
                className="fade-up flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link
                  to="/ejercicio/$id"
                  params={{ id: ex.id }}
                  className="flex min-w-0 flex-1 items-center gap-4"
                >
                  <img
                    src={ex.image}
                    alt=""
                    className="h-18 w-18 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {ex.category}
                    </p>

                    <p className="truncate font-display text-[17px]">
                      {ex.title}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {ex.minutes} min
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => setDel(ex.id)}
                  aria-label="Quitar"
                  className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
      </ul>

      <ConfirmDialog
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        description="El ejercicio se quitará de esta colección."
        onConfirm={async () => {
          if (del) {
            await removeItem.mutateAsync({
              collectionId: id,
              exerciseId: del,
            });
          }

          toast("Ejercicio eliminado");
          setDel(null);
        }}
      />
    </div>
  );
}
