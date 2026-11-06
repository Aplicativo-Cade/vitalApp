import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Leaf, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/ex-estiramiento.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceder — Vital" },
      { name: "description", content: "Inicia sesión en Vital, tu biblioteca de ejercicios geriátricos." },
      { property: "og:title", content: "Acceder — Vital" },
      { property: "og:description", content: "Inicia sesión en Vital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="group block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors group-focus-within:text-primary">
        {label}
      </span>
      <input
        {...rest}
        className="mt-1.5 w-full border-0 border-b border-input bg-transparent px-0 py-2.5 text-muted-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
      />
    </label>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/inicio", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/inicio", replace: true });
        else toast.success("Revisa tu correo para confirmar tu cuenta.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(msg.includes("Invalid login") ? "Correo o contraseña incorrectos." : msg || "Algo salió mal.");
    } finally {
      setLoading(false);
    }
  };

const google = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/inicio` },
  });
  if (error) toast.error("No se pudo iniciar sesión con Google.");
};

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden md:block">
        <img src={heroImg} alt="Persona mayor estirando con apoyo de una silla" className="absolute inset-0 h-full w-full object-cover" width={1024} height={768} />
        <div className="absolute inset-0 bg-overlay" />
        <p className="absolute bottom-10 left-10 max-w-sm font-display text-4xl leading-tight text-popover-foreground">
          Cada movimiento cuenta.
        </p>
      </div>

      <div className="flex min-h-screen flex-col px-7 pt-14 pb-10 md:justify-center md:px-16">
        <div className="fade-up mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2 text-primary">
            <Leaf className="h-5 w-5" strokeWidth={1.6} />
            <span className="font-display text-2xl">Vital</span>
          </div>

          <h1 className="mt-14 text-[2.6rem] leading-[1.05] text-foreground">
            {mode === "login" ? (
              <>Hola de <em className="text-primary">nuevo</em>.</>
            ) : (
              <>Crea tu <em className="text-primary">espacio</em>.</>
            )}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Ejercicios y sesiones para quienes cuidan a nuestros mayores.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-6">
            {mode === "signup" && (
              <Field label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Dra. Lucía Ortega" />
            )}
            <Field label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@centro.es" />
            <Field label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
            <Button type="submit" variant="hero" size="lg" className="mt-4 h-12 w-full text-[15px]" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {mode === "login" ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {mode === "login" ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button type="button" className="font-semibold text-primary underline-offset-4 hover:underline" onClick={() => window.location.href = "https://geria-activa-pro.base44.app/"}>
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
