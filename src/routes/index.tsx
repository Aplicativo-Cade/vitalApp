import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Vital — Ejercicios para el cuidado geriátrico" },
      { name: "description", content: "Biblioteca de ejercicios, sesiones exprés y colecciones para profesionales que atienden a personas mayores." },
      { property: "og:title", content: "Vital — Ejercicios para el cuidado geriátrico" },
      { property: "og:description", content: "Biblioteca de ejercicios y sesiones exprés para profesionales del cuidado de mayores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    throw redirect({ to: data.session ? "/inicio" : "/auth" });
  },
});
