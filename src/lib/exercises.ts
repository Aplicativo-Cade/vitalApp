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

export const EXERCISES: Exercise[] = [
  {
    id: "elevacion-brazos-sentado",
    title: "Elevación de brazos en silla",
    category: "Movilidad Reducida",
    level: "Sentado",
    minutes: 10,
    conditions: ["Movilidad reducida", "Autónomo"],
    focus: "Fuerza",
    image: sentado,
    objective: "Fortalecer hombros y mejorar el rango articular del tren superior.",
    materials: ["Silla estable sin ruedas", "Botellas de 0,5 L (opcional)"],
    indications: ["Rigidez de hombro", "Debilidad de miembros superiores", "Postoperatorio tardío"],
    precautions: ["No elevar por encima del dolor", "Evitar en hombro inestable sin valoración"],
    steps: [
      "Siéntese con la espalda apoyada y los pies firmes en el suelo.",
      "Extienda los brazos hacia los lados a la altura de los hombros.",
      "Eleve lentamente los brazos sobre la cabeza mientras inspira.",
      "Descienda en cuatro tiempos exhalando. Repita 10 veces.",
    ],
    tip: "Pida al paciente que cuente en voz alta: marca el ritmo y favorece la respiración.",
  },
  {
    id: "estiramiento-gemelo-silla",
    title: "Estiramiento de gemelos con apoyo",
    category: "Estiramientos",
    level: "De pie",
    minutes: 8,
    conditions: ["Autónomo"],
    focus: "Flexibilidad",
    image: estiramiento,
    objective: "Ganar elasticidad en la cadena posterior y prevenir calambres.",
    materials: ["Respaldo de silla firme"],
    indications: ["Acortamiento muscular", "Calambres nocturnos", "Marcha con paso corto"],
    precautions: ["Supervisar el equilibrio en todo momento", "No rebotar en el estiramiento"],
    steps: [
      "Apoye ambas manos en el respaldo de la silla.",
      "Lleve una pierna atrás con el talón pegado al suelo.",
      "Flexione la rodilla delantera hasta notar tensión en el gemelo.",
      "Mantenga 20 segundos y cambie de pierna. 3 series.",
    ],
    tip: "Coloque una marca en el suelo para que el paciente sepa dónde situar el pie trasero.",
  },
  {
    id: "pase-pelota-circulo",
    title: "Pase de pelota en círculo",
    category: "Dinámicas",
    level: "Grupal",
    minutes: 20,
    conditions: ["Autónomo", "Movilidad reducida", "Deterioro cognitivo"],
    focus: "Socialización",
    image: grupal,
    objective: "Estimular la coordinación óculo-manual y la interacción social.",
    materials: ["Pelota blanda", "Sillas en círculo"],
    indications: ["Aislamiento social", "Apatía", "Grupos heterogéneos"],
    precautions: ["Usar pelota ligera", "Distancia corta entre participantes"],
    steps: [
      "Disponga a los participantes sentados en círculo.",
      "Diga un nombre antes de pasar la pelota a esa persona.",
      "Añada una categoría: frutas, ciudades o colores.",
      "Aumente la velocidad progresivamente durante 10 minutos.",
    ],
    tip: "Celebre cada pase: el refuerzo positivo sostiene la participación del grupo.",
  },
  {
    id: "secuencias-tarjetas",
    title: "Secuencias con tarjetas",
    category: "Cognitivo",
    level: "Mesa",
    minutes: 15,
    conditions: ["Deterioro cognitivo", "Autónomo"],
    focus: "Memoria",
    image: cognitivo,
    objective: "Trabajar memoria de trabajo, atención y funciones ejecutivas.",
    materials: ["Tarjetas ilustradas", "Mesa amplia"],
    indications: ["Deterioro cognitivo leve", "Déficit atencional", "Prevención"],
    precautions: ["Evitar la frustración: ajuste la dificultad", "Buena iluminación"],
    steps: [
      "Muestre una secuencia de 3 tarjetas durante 10 segundos.",
      "Retírelas y pida que las ordene de nuevo.",
      "Si acierta, añada una tarjeta más a la secuencia.",
      "Finalice con una secuencia que domine para cerrar con éxito.",
    ],
    tip: "Termine siempre con un acierto: la sensación de logro mejora la adherencia.",
  },
  {
    id: "marcha-estatica",
    title: "Marcha estática sentado",
    category: "Físico",
    level: "Sentado",
    minutes: 10,
    conditions: ["Movilidad reducida", "Autónomo"],
    focus: "Fuerza",
    image: sentado,
    objective: "Activar la circulación y fortalecer flexores de cadera.",
    materials: ["Silla estable", "Música con ritmo suave"],
    indications: ["Sedentarismo", "Edema leve en miembros inferiores"],
    precautions: ["Controlar la frecuencia cardíaca", "Hidratación previa"],
    steps: [
      "Siéntese al borde de la silla con la espalda recta.",
      "Eleve alternadamente las rodillas como si caminara.",
      "Acompañe con balanceo de brazos.",
      "Mantenga 2 minutos, descanse 1 minuto. 3 rondas.",
    ],
    tip: "La música a 90-100 bpm ayuda a sostener un ritmo constante sin fatiga.",
  },
  {
    id: "equilibrio-tandem",
    title: "Equilibrio en tándem asistido",
    category: "Físico",
    level: "De pie",
    minutes: 12,
    conditions: ["Autónomo"],
    focus: "Equilibrio",
    image: estiramiento,
    objective: "Mejorar el control postural y reducir el riesgo de caídas.",
    materials: ["Pared o barra de apoyo", "Superficie antideslizante"],
    indications: ["Riesgo de caídas", "Inestabilidad leve"],
    precautions: ["Terapeuta siempre al lado", "Calzado cerrado"],
    steps: [
      "Colóquese junto a la pared con una mano apoyada.",
      "Ponga un pie delante del otro, talón con punta.",
      "Mantenga la posición 15 segundos mirando al frente.",
      "Alterne el pie delantero. 5 repeticiones por lado.",
    ],
    tip: "Reduzca el apoyo de mano a un solo dedo cuando la postura sea estable.",
  },
  {
    id: "rotacion-cuello",
    title: "Movilidad cervical suave",
    category: "Estiramientos",
    level: "Sentado",
    minutes: 6,
    conditions: ["Movilidad reducida", "Autónomo", "Deterioro cognitivo"],
    focus: "Flexibilidad",
    image: sentado,
    objective: "Liberar tensión cervical y mejorar la rotación de cabeza.",
    materials: ["Silla con respaldo"],
    indications: ["Rigidez cervical", "Cefalea tensional"],
    precautions: ["Evitar círculos completos", "Suspender ante mareo"],
    steps: [
      "Siéntese erguido con los hombros relajados.",
      "Gire la cabeza hacia la derecha lentamente.",
      "Vuelva al centro y gire hacia la izquierda.",
      "Incline la oreja hacia el hombro. 5 veces por lado.",
    ],
    tip: "Pida que siga con la mirada un objeto: hace el movimiento más natural.",
  },
  {
    id: "recuerdos-musicales",
    title: "Recuerdos musicales",
    category: "Dinámicas",
    level: "Grupal",
    minutes: 25,
    conditions: ["Deterioro cognitivo", "Autónomo", "Movilidad reducida"],
    focus: "Memoria",
    image: grupal,
    objective: "Evocar memoria autobiográfica y estimular la expresión emocional.",
    materials: ["Altavoz", "Lista de canciones de época"],
    indications: ["Demencia leve-moderada", "Estado de ánimo bajo"],
    precautions: ["Atención a reacciones emocionales intensas"],
    steps: [
      "Reproduzca el inicio de una canción conocida.",
      "Pregunte al grupo título, intérprete o año.",
      "Invite a compartir un recuerdo asociado.",
      "Cierre cantando juntos el estribillo.",
    ],
    tip: "Prepare canciones de cuando el grupo tenía entre 15 y 25 años: es la memoria más viva.",
  },
];

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

export function getExercise(id: string) {
  return EXERCISES.find((e) => e.id === id);
}
