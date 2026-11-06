import { useState } from "react";
import { Check, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollections, useCollectionMutations } from "@/lib/collections";
import { cn } from "@/lib/utils";

export function SaveToCollection({
  open,
  onOpenChange,
  exerciseIds,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  exerciseIds: string[];
  onSaved?: () => void;
}) {
  const { data, isLoading } = useCollections();
  const { create, addItems, removeItem } = useCollectionMutations();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const single = exerciseIds.length === 1 ? exerciseIds[0] : null;

  const toggle = async (collectionId: string, has: boolean) => {
    try {
      if (single && has) {
        await removeItem.mutateAsync({ collectionId, exerciseId: single });
        toast("Quitado de la colección");
      } else {
        await addItems.mutateAsync({ collectionId, exerciseIds });
        toast.success(exerciseIds.length > 1 ? `${exerciseIds.length} ejercicios guardados` : "Guardado");
        onSaved?.();
      }
    } catch {
      toast.error("No se pudo guardar.");
    }
  };

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const id = await create.mutateAsync(name.trim());
      await addItems.mutateAsync({ collectionId: id, exerciseIds });
      toast.success(`Guardado en «${name.trim()}»`);
      setName("");
      setCreating(false);
      onSaved?.();
    } catch {
      toast.error("No se pudo crear la colección.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-border bg-popover p-0">
        <DialogHeader className="px-6 pt-6 pb-4 text-left">
          <DialogTitle className="font-display text-2xl font-normal">Guardar en…</DialogTitle>
          <DialogDescription>
            {exerciseIds.length > 1 ? `${exerciseIds.length} ejercicios seleccionados` : "Elige una o varias colecciones"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto px-3">
          {isLoading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          {data?.length === 0 && !creating && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Aún no tienes colecciones.</p>
          )}
          {data?.map((c) => {
            const has = !!single && c.items.some((i) => i.exercise_id === single);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id, has)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-muted"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-display text-lg text-accent-foreground">
                  {c.name.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.items.length} ejercicios</span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                    has ? "border-primary bg-primary text-primary-foreground scale-100" : "border-input",
                  )}
                >
                  {has && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 border-t border-border p-3">
          {creating ? (
            <form onSubmit={submitNew} className="flex items-center gap-2 px-2 fade-up">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la colección"
                className="flex-1 border-0 border-b border-input bg-transparent py-2 text-sm outline-none focus:border-primary"
              />
              <button type="submit" className="shine rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground" disabled={create.isPending}>
                {create.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Crear"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary transition-colors hover:bg-muted"
            >
              <Plus className="h-4 w-4" /> Crear nueva colección
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
