import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, X, Sparkles, Bookmark } from "lucide-react";
import { CATEGORIES, EXERCISES, filterExpress, type ExpressFilters } from "@/lib/exercises";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ExpressSheet } from "@/components/ExpressSheet";
import { SaveToCollection } from "@/components/SaveToCollection";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollections } from "@/lib/collections";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/inicio")({
  head: () => ({
    meta: [
      { title: "Biblioteca — Vital" },
      { name: "description", content: "Explora ejercicios físicos, cognitivos y dinámicas para personas mayores." },
      { property: "og:title", content: "Biblioteca — Vital" },
      { property: "og:description", content: "Explora ejercicios para personas mayores." },
    ],
  }),
  component: Inicio,
});

function greeting() {
  const h = new Date().getHours();
  return h < 13 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
}

function Inicio() {
  const { user } = Route.useRouteContext();
  const name = (user.user_metadata?.["full_name"] as string | undefined)?.split(" ")[0] ?? user.email?.split("@")[0];
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [cat, setCat] = useState<string>("Todos");
  const [sheet, setSheet] = useState(false);
  const [express, setExpress] = useState<ExpressFilters | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [saveIds, setSaveIds] = useState<string[] | null>(null);
  const { data: collections } = useCollections();

  const savedSet = useMemo(() => new Set(collections?.flatMap((c) => c.items.map((i) => i.exercise_id))), [collections]);
  const searching = query !== debounced;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const list = useMemo(() => {
    let l = express ? filterExpress(EXERCISES, express) : EXERCISES;
    if (cat !== "Todos") l = l.filter((e) => e.category === cat);
    const q = debounced.trim().toLowerCase();
    if (q) l = l.filter((e) => (e.title + e.category + e.objective + e.focus).toLowerCase().includes(q));
    return l;
  }, [express, cat, debounced]);

  const toggleSel = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="px-5 pt-10">
      <header className="fade-up">
        <p className="text-sm text-muted-foreground">{greeting()},</p>
        <h1 className="mt-0.5 text-4xl leading-tight text-muted-foreground">
          {name} <span className="text-primary">.</span>
        </h1>
      </header>
      <div className="fade-up mt-6 flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3.5 shadow-soft transition-all focus-within:border-primary/50 focus-within:shadow-lift" style={{ animationDelay: "60ms" }}>
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ejercicios, objetivos…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-primary"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Limpiar">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="fade-up mt-6 flex items-center gap-3" style={{ animationDelay: "120ms" }}>
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Filtrar por:</span>
        <div className="no-scrollbar -mr-5 flex gap-2 overflow-x-auto pr-5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all duration-300",
                cat === c ? "border-foreground bg-accent text-muted-foreground" : "border-border text-muted-foreground hover:border-foreground/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {express && (
        <div className="fade-up mt-6 flex items-center justify-between rounded-2xl bg-accent px-4 py-3 text-accent-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="font-semibold">Sesión exprés</span>
            <span className="opacity-70">· {list.length} ejercicios</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <button onClick={() => setSelected(selected.length === list.length ? [] : list.map((e) => e.id))} className="underline-offset-4 hover:underline">
              {selected.length === list.length && list.length > 0 ? "Deseleccionar" : "Seleccionar todos"}
            </button>
            <button onClick={() => { setExpress(null); setSelected([]); }} aria-label="Quitar sesión exprés">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3.5">
        {searching
          ? [0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("overflow-hidden rounded-[1.4rem] bg-card", i === 0 && "col-span-2")}>
                <Skeleton className={cn("rounded-none", i === 0 ? "aspect-[16/9]" : "aspect-[4/5]")} />
                <div className="space-y-2 p-3.5">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))
          : list.map((ex, i) => (
              <ExerciseCard
                key={ex.id}
                ex={ex}
                index={i}
                featured={i === 0 && !express}
                saved={savedSet.has(ex.id)}
                onSave={() => setSaveIds([ex.id])}
                selectable={!!express}
                selected={selected.includes(ex.id)}
                onSelect={() => toggleSel(ex.id)}
              />
            ))}
        {!searching && list.length === 0 && (
          <p className="col-span-2 py-16 text-center text-sm text-muted-foreground">No hay ejercicios con estos criterios.</p>
        )}
      </section>

      {selected.length > 0 ? (
        <button
          onClick={() => setSaveIds(selected)}
          className="shine fade-up fixed right-5 bottom-24 z-30 flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 text-sm font-semibold text-gold-foreground shadow-lift"
        >
          <Bookmark className="h-4 w-4" /> Guardar {selected.length}
        </button>
      ) : (
        <button
          onClick={() => setSheet(true)}
          aria-label="Generar sesión exprés"
          className="shine fixed right-5 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-hero text-primary-foreground shadow-lift transition-transform hover:rotate-6 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M13 3 6 13h5l-1 8 7-10h-5l1-8Z" />
          </svg>
        </button>
      )}

      <ExpressSheet
        open={sheet}
        onClose={() => setSheet(false)}
        onGenerate={(f) => {
          setExpress(f);
          setCat("Todos");
          setSelected([]);
          setSheet(false);
        }}
      />
      <SaveToCollection
        open={!!saveIds}
        onOpenChange={(o) => !o && setSaveIds(null)}
        exerciseIds={saveIds ?? []}
        onSaved={() => {
          if ((saveIds?.length ?? 0) > 1) {
            setSelected([]);
            setSaveIds(null);
          }
        }}
      />
    </div>
  );
}
