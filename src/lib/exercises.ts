import sentado from "@/assets/ex-sentado.jpg";
import estiramiento from "@/assets/ex-estiramiento.jpg";
import grupal from "@/assets/ex-grupal.jpg";
import cognitivo from "@/assets/ex-cognitivo.jpg";

export const CATEGORIES = [
  "Todos",
  "Físico",
  "Movilidad Reducida",
  "Estiramientos",
  "Cognitivo",
  "Dinámicas",
] as const;
export type Category = Exclude<(typeof CATEGORIES)[number], "Todos">;

export type Condition = "Autónomo" | "Movilidad reducida" | "Deterioro cognitivo";
export type Focus = "Fuerza" | "Equilibrio" | "Flexibilidad" | "Memoria" | "Socialización";

export interface Exercise {
  id: string;
  title: string;
  category: Category;
  level: string;
  minutes: number;
  conditions: Condition[];
  focus: Focus;
  image: string;
  objective: string;
  materials: string[];
  indications: string[];
  precautions: string[];
  steps: string[];
  tip: string;
}

export const TIME_OPTIONS = ["≤ 10 min", "10–20 min", "> 20 min"] as const;
export const CONDITION_OPTIONS: Condition[] = ["Autónomo", "Movilidad reducida", "Deterioro cognitivo"];
export const FOCUS_OPTIONS: Focus[] = ["Fuerza", "Equilibrio", "Flexibilidad", "Memoria", "Socialización"];

export interface ExpressFilters {
  time: string[];
  condition: Condition[];
  focus: Focus[];
}

function matchesTime(min: number, t: string) {
  if (t === "≤ 10 min") return min <= 10;
  if (t === "10–20 min") return min > 10 && min <= 20;
  return min > 20;
}

export function filterExpress(list: Exercise[], f: ExpressFilters) {
  return list.filter(
    (e) =>
      (f.time.length === 0 || f.time.some((t) => matchesTime(e.minutes, t))) &&
      (f.condition.length === 0 || f.condition.some((c) => e.conditions.includes(c))) &&
      (f.focus.length === 0 || f.focus.includes(e.focus)),
  );
}
