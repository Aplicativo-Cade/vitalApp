import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bookmark, Package, Printer, ShieldAlert, Target, CheckCircle2, Quote } from "lucide-react";
import { toast } from "sonner";
import { getExercise } from "@/lib/exercises";
import { SaveToCollection } from "@/components/SaveToCollection";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/ejercicio/$id")({
  loader: ({ params }) => {
    const ex = getExercise(params.id);
    if (!ex) throw notFound();
    return { ex };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.ex.title} — Vital` : "Ejercicio — Vital" },
      { name: "description", content: loaderData?.ex.objective ?? "Detalle del ejercicio" },
      { property: "og:title", content: loaderData?.ex.title ?? "Ejercicio" },
      { property: "og:description", content: loaderData?.ex.objective ?? "" },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { ex } = Route.useLoaderData();
  const [save, setSave] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: ex.title, url }).catch(() => {});
    else {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    }
  };

  return (
    <div className="fade-up">
      <div className="relative">
        <img src={ex.image} alt={ex.title} width={1024} height={768} className="aspect-[4/3] w-full object-cover md:rounded-b-[2rem]" />
        <div className="no-print absolute inset-x-0 top-0 flex justify-between p-4">
          <Link to="/inicio" className="glass flex h-10 w-10 items-center justify-center rounded-full border border-border" aria-label="Volver">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative -mt-8 rounded-t-[2rem] bg-background px-6 pt-7">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{ex.category}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Nivel: {ex.level}</span>
          <span className="ml-auto text-xs text-muted-foreground">{ex.minutes} min</span>
        </div>
        <h1 className="mt-3 text-[2.4rem] leading-[1.05]">{ex.title}</h1>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <Target className="h-4 w-4 text-primary" strokeWidth={1.6} />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Objetivo</p>
            <p className="mt-1 text-sm leading-relaxed">{ex.objective}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <Package className="h-4 w-4 text-primary" strokeWidth={1.6} />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Materiales</p>
            <ul className="mt-1 space-y-1 text-sm">
              {ex.materials.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl">Indicaciones</h2>
          <ul className="mt-3 space-y-2">
            {ex.indications.map((i) => (
              <li key={i} className="flex gap-2.5 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-4">
          <h2 className="flex items-center gap-2 text-lg"><ShieldAlert className="h-4 w-4 text-gold" /> Precauciones de seguridad</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
            {ex.precautions.map((p) => <li key={p}>— {p}</li>)}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl">Paso a paso</h2>
          {/* Layout alterado para Flexbox adaptativo sem carrossel horizontal */}
          <div className="mt-4 flex flex-wrap gap-3 print:flex-col print:px-0">
            {ex.steps.map((s, i) => (
              <div key={i} className="flex-1 min-w-[240px] rounded-2xl bg-card p-5 shadow-soft print:w-full">
                <span className="font-display text-4xl text-primary/30">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-hero mt-8 rounded-[1.6rem] p-6 text-primary-foreground">
          <Quote className="h-5 w-5 opacity-60" />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">Consejo del terapeuta</p>
          <p className="mt-2 font-display text-xl leading-snug">{ex.tip}</p>
        </section>
      </div>

      <div className="no-print sticky bottom-24 lg:bottom-1 z-20 mt-8 flex gap-2 px-6">
        <Button variant="hero" size="lg" className="h-12 flex-1" onClick={() => setSave(true)}>
          <Bookmark /> Añadir a colección
        </Button>
        <Button variant="print" size="lg" className="h-12" onClick={() => window.print()}>
          <Printer /> PDF
        </Button>
      </div>

      <SaveToCollection open={save} onOpenChange={setSave} exerciseIds={[ex.id]} />
    </div>
  );
}