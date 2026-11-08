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
    <div className="fade-up print:m-0 print:p-0" style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>
      {/* Imagem de Capa (Compacta na impressão) */}
      <div className="relative print:max-h-[420px] print:overflow-hidden">
        <img 
          src={ex.image} 
          alt={ex.title} 
          width={1024} 
          height={768} 
          className="aspect-[16/9] md:aspect-[4/3] w-full object-cover md:rounded-b-[2rem] print:rounded-none print:h-[400px]" 
        />
        <div className="no-print absolute inset-x-0 top-0 flex justify-between p-4">
          <Link to="/inicio" className="glass flex h-10 w-10 items-center justify-center rounded-full border border-border" aria-label="Volver">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative -mt-8 rounded-t-[2rem] bg-background px-6 pt-7 print:mt-0 print:px-4 print:pt-3 print:bg-white print:text-black">
        
        {/* Cabeçalho / Metadados */}
        <div className="flex items-center gap-2 print:text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground print:text-zinc-600">{ex.category}</span>
          <span className="h-1 w-1 rounded-full bg-border print:bg-zinc-400" />
          <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-accent-foreground print:bg-emerald-100 print:text-emerald-900">Nivel: {ex.level}</span>
          <span className="ml-auto text-xs text-muted-foreground print:text-zinc-600">{ex.minutes} min</span>
        </div>
        
        <h1 className="mt-2 text-[2.2rem] leading-[1.05] print:text-2xl print:font-bold print:text-zinc-900">{ex.title}</h1>

        {/* Grid de Objetivo e Materiais */}
        <div className="mt-3 grid grid-cols-2 gap-3 print:gap-2">
          <div className="rounded-2xl bg-card p-3.5 shadow-soft print:bg-[#f4f7f5] print:border print:border-[#d2e0d9] print:p-2.5">
            <div className="flex items-center gap-1.5 text-primary print:text-[#1b3b36]">
              <Target className="h-4 w-4" strokeWidth={1.6} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Objetivo</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed print:text-zinc-700">{ex.objective}</p>
          </div>
          
          <div className="rounded-2xl bg-card p-3.5 shadow-soft print:bg-[#f4f7f5] print:border print:border-[#d2e0d9] print:p-2.5">
            <div className="flex items-center gap-1.5 text-primary print:text-[#1b3b36]">
              <Package className="h-4 w-4" strokeWidth={1.6} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Materiales</span>
            </div>
            <ul className="mt-1 space-y-0.5 text-xs print:text-zinc-700">
              {ex.materials.map((m) => <li key={m}>• {m}</li>)}
            </ul>
          </div>
        </div>

        {/* Seção Indicaciones e Precauciones lado a lado na impressão para economizar espaço */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2">
          <section className="rounded-xl bg-card/50 p-3 print:bg-[#f4f7f5] print:border print:border-[#d2e0d9]">
            <h2 className="text-sm font-semibold print:text-xs uppercase tracking-wide text-foreground print:text-zinc-900">Indicaciones</h2>
            <ul className="mt-1.5 space-y-1">
              {ex.indications.map((i) => (
                <li key={i} className="flex gap-2 text-xs print:text-[11px] text-muted-foreground print:text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary print:text-[#1b3b36]" />{i}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-gold/40 bg-gold/10 p-3 print:border-[#e6d5b8] print:bg-[#fcf9f2]">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold print:text-xs uppercase tracking-wide text-foreground print:text-[#8a6d2b]">
              <ShieldAlert className="h-3.5 w-3.5 text-gold print:text-[#c5a059]" /> Precauciones
            </h2>
            <ul className="mt-1.5 space-y-1 text-xs print:text-[11px] text-foreground/85 print:text-zinc-700">
              {ex.precautions.map((p) => <li key={p}>— {p}</li>)}
            </ul>
          </section>
        </div>

        {/* Paso a paso - Compacto e horizontal na impressão */}
        <section className="mt-3 print:mt-2.5">
          <h2 className="text-lg font-semibold print:text-sm">Paso a paso</h2>
          <div className="mt-2 flex flex-wrap gap-2 print:flex-nowrap print:gap-2">
            {ex.steps.map((s, i) => (
              <div key={i} className="flex-1 min-w-[200px] rounded-xl bg-card p-3 shadow-soft print:bg-[#f4f7f5] print:border print:border-[#d2e0d9] print:p-2">
                <span className="font-display text-2xl text-primary/30 print:text-[#1b3b36]/30">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 text-xs leading-tight print:text-[10px] print:text-zinc-700">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Consejo del terapeuta */}
        <section className="bg-hero mt-3 rounded-2xl p-4 text-primary-foreground print:mt-2.5 print:bg-[#1b3b36] print:text-white print:p-2.5">
          <div className="flex items-center gap-2">
            <Quote className="h-4 w-4 opacity-60" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-80">Consejo del terapeuta</p>
          </div>
          <p className="mt-1 font-display text-sm leading-snug print:text-xs">{ex.tip}</p>
        </section>
      </div>

      {/* Botões de Ação (Ocultos na impressão) */}
      <div className="no-print sticky bottom-24 lg:bottom-1 z-20 mt-6 flex gap-2 px-6 pb-6">
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