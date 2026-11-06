import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { CONDITION_OPTIONS, FOCUS_OPTIONS, TIME_OPTIONS, type ExpressFilters } from "@/lib/exercises";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pills<T extends string>({ title, options, value, onChange }: { title: string; options: readonly T[]; value: T[]; onChange: (v: T[]) => void }) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExpressSheet({ open, onClose, onGenerate }: { open: boolean; onClose: () => void; onGenerate: (f: ExpressFilters) => void }) {
  const [f, setF] = useState<ExpressFilters>({ time: [], condition: [], focus: [] });
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 450);
    return () => clearTimeout(t);
  }, [open]);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className={cn("absolute inset-0 bg-overlay backdrop-blur-md transition-opacity duration-500", open ? "opacity-100" : "opacity-0")}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto flex h-[55vh] max-w-2xl flex-col rounded-t-[2rem] border-t border-border bg-popover shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          open ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
        aria-label="Sesión exprés"
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-start justify-between px-6 pt-4">
          <div>
            <h2 className="text-2xl">Sesión exprés</h2>
            <p className="text-sm text-muted-foreground">Arma una sesión en segundos.</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <Pills title="Tiempo" options={TIME_OPTIONS} value={f.time} onChange={(time) => setF({ ...f, time })} />
          <Pills title="Condición del paciente" options={CONDITION_OPTIONS} value={f.condition} onChange={(condition) => setF({ ...f, condition })} />
          <Pills title="Enfoque" options={FOCUS_OPTIONS} value={f.focus} onChange={(focus) => setF({ ...f, focus })} />
        </div>
        <div className="border-t border-border px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="hero" size="lg" className="h-12 w-full text-[15px]" onClick={() => onGenerate(f)}>
            <Sparkles /> Generar sesión exprés
          </Button>
        </div>
      </div>
    </div>
  );
}
