import { Link } from "@tanstack/react-router";
import { Bookmark, Check, Clock } from "lucide-react";
import type { Exercise } from "@/lib/exercises";
import { cn } from "@/lib/utils";

export function ExerciseCard({
  ex,
  onSave,
  saved,
  featured,
  selectable,
  selected,
  onSelect,
  index = 0,
}: {
  ex: Exercise;
  onSave: () => void;
  saved?: boolean;
  featured?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  index?: number;
}) {
  return (
    <article
      className={cn(
        "fade-up group relative overflow-hidden rounded-[1.4rem] bg-card shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lift",
        featured && "col-span-2",
        selected && "ring-2 ring-primary",
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link to="/ejercicio/$id" params={{ id: ex.id }} className="block">
        <div className={cn("overflow-hidden", featured ? "aspect-[16/9]" : "aspect-[4/5]")}>
          <img
            src={ex.image}
            alt={ex.title}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {ex.category}
          </p>
          <h3 className={cn("mt-1 leading-snug text-card-foreground", featured ? "text-2xl" : "text-[17px]")}>
            {ex.title}
          </h3>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {ex.minutes} min · {ex.level}
          </p>
        </div>
      </Link>

      <div className="absolute top-2.5 right-2.5 flex gap-1.5">
        {selectable && (
          <button
            onClick={onSelect}
            aria-label="Seleccionar"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-all",
              selected ? "border-primary bg-primary text-primary-foreground" : "glass border-border text-foreground",
            )}
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onSave}
          aria-label="Guardar en colección"
          className="glass flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-transform active:scale-90"
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-current text-gold")} />
        </button>
      </div>
    </article>
  );
}
