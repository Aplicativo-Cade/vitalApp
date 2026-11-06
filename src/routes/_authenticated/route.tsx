import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Home, LogOut, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: Shell,
});

function Shell() {
  const { user } = Route.useRouteContext();
  const { dark, toggle } = useTheme();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const fullName = (user.user_metadata?.["full_name"] as string | undefined) ?? user.email?.split("@")[0] ?? "Usuario";
  const email = user.email ?? "";

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl pb-28 lg:pb-0 lg:pl-50 lg:py-8">
      <Outlet />

      {/* NAV / SIDEBAR RESPONSIVA */}
      <nav 
        className="no-print glass fixed z-30 flex border border-border shadow-lift transition-all
          /* MOBILE & TABLET: Barra inferior horizontal */
          bottom-4 left-1/2 -translate-x-1/2 items-center gap-2 rounded-full px-3 py-2 flex-row
          /* DESKTOP (lg): Sidebar lateral vertical estilo referência */
          lg:bottom-auto lg:top-8 lg:left-8 lg:translate-x-0 lg:flex-col lg:items-stretch lg:w-64 lg:p-4 lg:rounded-[2rem] lg:gap-4 lg:bg-card"
      >
        {/* BLOCO DO PERFIL (Apenas Desktop) */}
        <div className="hidden lg:flex items-center gap-3 pb-4 border-b border-border px-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden shrink-0">
            {user.user_metadata?.["avatar_url"] ? (
              <img src={user.user_metadata["avatar_url"]} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-foreground">{fullName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        {/* ITENS DE NAVEGAÇÃO PRINCIPAL */}
        <div className="flex lg:flex-col gap-1.5 w-full">
          <Link
            to="/inicio"
            className="flex flex-col lg:flex-row items-center lg:justify-between px-3 py-1.5 lg:px-4 lg:py-3 rounded-2xl lg:rounded-xl text-[10px] lg:text-sm font-medium text-muted-foreground transition-colors relative group hover:text-foreground"
            activeProps={{ className: "bg-primary/10 lg:bg-primary !text-primary lg:!text-primary-foreground font-semibold" }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-0.5 lg:gap-3">
              <Home className="h-4 w-4 shrink-0" /> 
              <span>Inicio</span>
            </div>
            <span className="hidden lg:block absolute right-3 w-1.5 h-4 rounded-full bg-primary opacity-0 group-[.active]:opacity-100" />
          </Link>

          <Link
            to="/colecciones"
            className="flex flex-col lg:flex-row items-center lg:justify-between px-3 py-1.5 lg:px-4 lg:py-3 rounded-2xl lg:rounded-xl text-[10px] lg:text-sm font-medium text-muted-foreground transition-colors relative group hover:text-foreground"
            activeProps={{ className: "bg-primary/10 lg:bg-primary !text-primary lg:!text-primary-foreground font-semibold" }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-0.5 lg:gap-3">
              <Bookmark className="h-4 w-4 shrink-0" /> 
              <span>Colecciones</span>
            </div>
          </Link>
        </div>

        {/* BLOCO INFERIOR DESKTOP */}
        <div className="hidden lg:flex flex-col gap-1 pt-3 border-t border-border mt-auto">
          <button 
            onClick={toggle} 
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full text-left"
          >
            {dark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />} 
            <span>Cambiar Tema</span>
          </button>

          <button 
            onClick={signOut} 
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4 shrink-0" /> 
            <span>Cerrar sesión</span>
          </button>
        </div>

        {/* BOTÕES MOBILE (Tema e Sair na horizontal com texto abaixo) */}
        <div className="flex lg:hidden items-center gap-1.5">
          <button onClick={toggle} className="flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[10px] font-medium text-muted-foreground" aria-label="Cambiar tema">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Tema
          </button>
          <button onClick={signOut} className="flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[10px] font-medium text-destructive" aria-label="Cerrar sesión">
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </nav>
    </div>
  );
}