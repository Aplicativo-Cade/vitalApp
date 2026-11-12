
import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCollections, useCollectionMutations } from "@/lib/collections";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useExercises } from "@/integrations/supabase/useExercises";

export const Route = createFileRoute("/_authenticated/colecciones")({
  head: () => ({
    meta: [
      { title: "Mis colecciones — Vital" },
      { name: "description", content: "Gestiona tus colecciones de ejercicios." },
      { property: "og:title", content: "Mis colecciones — Vital" },
      { property: "og:description", content: "Gestiona tus colecciones de ejercicios." },
    ],
  }),
  component: Layout,
});

function Layout() {
  const match = useMatchRoute();

  if (match({ to: "/colecciones/$id" })) {
    return <Outlet />;
  }

  return <Collections />;
}

function Collections() {
  const { data, isLoading } = useCollections();
  const { data: exercises = [], isLoading: isExercisesLoading } = useExercises();

  const { rename, remove } = useCollectionMutations();

  const [del, setDel] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");

  // Índice dos exercícios para localizar as imagens pelo ID.
  const exerciseById = new Map(
    exercises.map((exercise) => [exercise.id, exercise])
  );

  const saveName = async (id: string) => {
    if (name.trim()) {
      await rename.mutateAsync({ id, name: name.trim() });
    }

    setEditing(null);
  };

  const loading = isLoading || isExercisesLoading;

  return (
    <div className="px-5 pt-10 pb-20">
      <h1 className="fade-up text-4xl">Colecciones</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tus sesiones y favoritos, a mano.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {loading &&
          [0, 1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className={cn(
                "rounded-[1.4rem]",
                i % 3 === 0 ? "col-span-2 h-48" : "h-60"
              )}
            />
          ))}

        {!loading && data?.length === 0 && (
          <p className="col-span-2 rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            Guarda ejercicios con el marcador para crear tu primera colección.
          </p>
        )}

        {!loading &&
          data?.map((c, i) => {
            // Três ou mais exercícios: ocupa a linha inteira.
            const isWide = c.items.length >= 3;

            // Busca as imagens dos exercícios no resultado do Supabase.
            const covers = c.items
              .slice(0, 3)
              .map((item) => exerciseById.get(item.exercise_id)?.image)
              .filter((image): image is string => Boolean(image));

            return (
              <div
                key={c.id}
                className={cn(
                  "fade-up group relative overflow-hidden rounded-[1.4rem] bg-card border border-border/50 shadow-soft transition-all hover:shadow-lift",
                  isWide ? "col-span-2" : "col-span-1"
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Link
                  to="/colecciones/$id"
                  params={{ id: c.id }}
                  className="block relative"
                >
                  <div
                    className={cn(
                      "grid gap-0.5 bg-muted",
                      isWide ? "h-48 grid-cols-3" : "h-56 grid-cols-1"
                    )}
                  >
                    {covers.length ? (
                      covers.slice(0, isWide ? 3 : 1).map((src, k) => (
                        <img
                          key={k}
                          src={src}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ))
                    ) : (
                      <div className="bg-hero col-span-3 flex items-center justify-center font-display text-5xl text-primary-foreground/40">
                        {c.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </Link>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-4 text-white">
                  <div className="pointer-events-auto min-w-0">
                    {editing === c.id ? (
                      <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => saveName(c.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && saveName(c.id)
                        }
                        className="w-full border-0 border-b border-white bg-transparent pb-1 font-display text-lg text-white outline-none"
                      />
                    ) : (
                      <Link
                        to="/colecciones/$id"
                        params={{ id: c.id }}
                        className="block group-hover:underline"
                      >
                        <h3 className="truncate text-sm font-semibold drop-shadow-md">
                          {c.name}
                        </h3>
                        <p className="text-xs text-white/80 drop-shadow">
                          {c.items.length} ejercicios
                        </p>
                      </Link>
                    )}
                  </div>

                  <div className="pointer-events-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                        aria-label="Opciones"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(c.id);
                            setName(c.name);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          Renombrar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDel(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <ConfirmDialog
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        description="Se eliminará la colección y todos sus ejercicios guardados."
        onConfirm={async () => {
          if (del) {
            await remove.mutateAsync(del);
          }

          toast("Colección eliminada");
          setDel(null);
        }}
      />
    </div>
  );
}
