// app/src/constants/challenges.js

/**
 * Configuração de Tiers
 */
export const TIER_CONFIG = {
  semRanking: {
    id: "semRanking",
    icon: "🔓",
    color: "#6B7280",
    label: "Sem Ranking",
    index: 0,
  },
  cobre: {
    id: "cobre",
    icon: "🟤",
    color: "#B87333",
    label: "Cobre",
    index: 1,
  },
  ferro: {
    id: "ferro",
    icon: "🪨",
    color: "#71717A",
    label: "Ferro",
    index: 2,
  },
  bronze: {
    id: "bronze",
    icon: "🥉",
    color: "#CD7F32",
    label: "Bronze",
    index: 3,
  },
  prata: {
    id: "prata",
    icon: "🥈",
    color: "#C0C0C0",
    label: "Prata",
    index: 4,
  },
  ouro: {
    id: "ouro",
    icon: "🥇",
    color: "#FFD700",
    label: "Ouro",
    index: 5,
  },
  platina: {
    id: "platina",
    icon: "💎",
    color: "#00D4AA",
    label: "Platina",
    index: 6,
  },
  esmeralda: {
    id: "esmeralda",
    icon: "💚",
    color: "#50C878",
    label: "Esmeralda",
    index: 7,
  },
  rubi: {
    id: "rubi",
    icon: "❤️",
    color: "#E0115F",
    label: "Rubi",
    index: 8,
  },
  diamante: {
    id: "diamante",
    icon: "💎",
    color: "#B9F2FF",
    label: "Diamante",
    index: 9,
  },
  diamanteAzul: {
    id: "diamanteAzul",
    icon: "💠",
    color: "#4169E1",
    label: "Diamante Azul",
    index: 10,
  },
};

/**
 * Lista ordenada de tiers
 */
export const TIER_ORDER = [
  "semRanking",
  "cobre",
  "ferro",
  "bronze",
  "prata",
  "ouro",
  "platina",
  "esmeralda",
  "rubi",
  "diamante",
  "diamanteAzul",
];

/**
 * Definição de todos os desafios
 */
export const CHALLENGES = {
  constanciaReal: {
    id: "constanciaReal",
    name: "Constância Real",
    description: "Total de treinos completos",
    icon: "🔥",
    color: "#EF4444",
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 5,
      bronze: 15,
      prata: 30,
      ouro: 50,
      platina: 80,
      esmeralda: 120,
      rubi: 200,
      diamante: 350,
      diamanteAzul: 500,
    },
  },
  sequenciasDeFogo: {
    id: "sequenciasDeFogo",
    name: "Sequências de Fogo",
    description: "Melhor streak de dias consecutivos",
    icon: "⚡",
    color: "#F59E0B",
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 3,
      bronze: 7,
      prata: 10,
      ouro: 15,
      platina: 25,
      esmeralda: 40,
      rubi: 60,
      diamante: 100,
      diamanteAzul: 150,
    },
  },
  volumeBruto: {
    id: "volumeBruto",
    name: "Volume Bruto",
    description: "Total de exercícios completos",
    icon: "💪",
    color: "#8B5CF6",
    thresholds: {
      semRanking: 0,
      cobre: 25,
      ferro: 100,
      bronze: 300,
      prata: 600,
      ouro: 1000,
      platina: 2000,
      esmeralda: 4000,
      rubi: 7000,
      diamante: 12000,
      diamanteAzul: 20000,
    },
  },
  perfeccionista: {
    id: "perfeccionista",
    name: "Perfeccionista",
    description: "Taxa de conclusão (últimos 30 treinos)",
    icon: "🎯",
    color: "#10B981",
    thresholds: {
      semRanking: 0,
      cobre: 40,
      ferro: 50,
      bronze: 60,
      prata: 65,
      ouro: 70,
      platina: 75,
      esmeralda: 80,
      rubi: 85,
      diamante: 90,
      diamanteAzul: 95,
    },
    isPercentage: true,
  },
  semanasImpecareis: {
    id: "semanasImpecareis",
    name: "Semanas Impecáveis",
    description: "Semanas com 7/7 dias completos",
    icon: "🌟",
    color: "#EC4899",
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 2,
      bronze: 3,
      prata: 5,
      ouro: 7,
      platina: 10,
      esmeralda: 15,
      rubi: 22,
      diamante: 30,
      diamanteAzul: 50,
    },
  },
  inabalavel: {
    id: "inabalavel",
    name: "Inabalável",
    description: 'Dias consecutivos sem "não quero"',
    icon: "🛡️",
    color: "#3B82F6",
    thresholds: {
      semRanking: 0,
      cobre: 3,
      ferro: 7,
      bronze: 14,
      prata: 21,
      ouro: 30,
      platina: 50,
      esmeralda: 75,
      rubi: 120,
      diamante: 180,
      diamanteAzul: 365,
    },
  },
  veterania: {
    id: "veterania",
    name: "Veterania",
    description: "Tempo total ativo no app",
    icon: "📅",
    color: "#14B8A6",
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 7,
      bronze: 14,
      prata: 30,
      ouro: 60,
      platina: 90,
      esmeralda: 180,
      rubi: 270,
      diamante: 365,
      diamanteAzul: 730,
    },
  },
};

/**
 * Lista ordenada de desafios
 */
export const CHALLENGE_ORDER = [
  "constanciaReal",
  "sequenciasDeFogo",
  "volumeBruto",
  "perfeccionista",
  "semanasImpecareis",
  "inabalavel",
  "veterania",
];

/**
 * Mensagens de celebração por tier
 */
export const TIER_MESSAGES = {
  cobre: [
    "Primeira conquista!",
    "Você começou sua jornada!",
    "O primeiro passo foi dado!",
  ],
  ferro: [
    "Progresso sólido!",
    "Continue assim!",
    "Você está no caminho certo!",
  ],
  bronze: [
    "Ótimo trabalho!",
    "Sua dedicação está evidente!",
    "Continue evoluindo!",
  ],
  prata: ["Impressionante!", "Você está brilhando!", "Constância de verdade!"],
  ouro: ["Extraordinário!", "Você é ouro puro!", "Desempenho excepcional!"],
  platina: [
    "Elite absoluta!",
    "Você é imparável!",
    "Performance de alto nível!",
  ],
  esmeralda: [
    "Lendário!",
    "Você transcendeu!",
    "Raríssimo encontrar alguém assim!",
  ],
  rubi: ["Mítico!", "Pouquíssimos chegam aqui!", "Você é uma inspiração!"],
  diamante: [
    "Diamante bruto!",
    "Absolutamente excepcional!",
    "Você redefiniu os limites!",
  ],
  diamanteAzul: [
    "O TOPO ABSOLUTO!",
    "LENDA VIVA!",
    "VOCÊ É O MELHOR DOS MELHORES!",
  ],
};
