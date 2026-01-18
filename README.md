# TrueStreak

> **O app de treino que não te pune por ser humano**

TrueStreak é um aplicativo de rastreamento de treinos com sistema de gamificação que valoriza o esforço real, não a perfeição. Nossa filosofia central: **"Dias difíceis não apagam o teu progresso e todo seu esforço deve ser recompensado"**.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características Principais](#-características-principais)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Desenvolvimento](#-desenvolvimento)
- [Build e Deploy](#-build-e-deploy)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Arquitetura](#-arquitetura)
- [Filosofia do Produto](#-filosofia-do-produto)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

TrueStreak é uma plataforma completa de acompanhamento fitness que combina:

- **App Web (React)**: Interface principal para usuários rastrearem seus treinos
- **Landing Page**: Página de apresentação do produto
- **Backend (Firebase)**: Autenticação, banco de dados e Cloud Functions

O diferencial está no sistema de gamificação que **reconhece todo esforço** ao invés de punir falhas, criando uma experiência de uso mais humana e sustentável.

---

## ✨ Características Principais

### Sistema de Conquistas (11 Tiers)
- Progressão inspirada em League of Legends
- Níveis: Sem Ranking → Cobre → Ferro → Bronze → Prata → Ouro → Platina → Esmeralda → Rubi → Diamante → Diamante Azul
- 7 categorias de desafios diferentes

### Gamificação Inteligente
- Pausas não resetam o histórico
- Recompensas incrementais contínuas
- Sempre há uma próxima meta a alcançar
- Celebrações visuais (confetti, modals, badges)

### Design System
- Tema dark com glassmorphism
- Paleta: Roxo (`#7A4BFF`), Dourado (`#E5D2AA`), Verde (`#10B981`)
- Tipografia: Plus Jakarta Sans
- Animações suaves e responsivas

---

## 🛠 Stack Tecnológica

### Frontend (App)
- **React 18.3** - UI Library
- **React Router 6** - Navegação
- **Vite 5** - Build tool
- **SCSS** - Estilização
- **React Confetti** - Animações de celebração

### Frontend (Landing)
- **Vanilla JavaScript** - Scripts customizados
- **SCSS** - Estilização modular
- **ESBuild** - Bundling
- **Browser Sync** - Live reload

### Backend
- **Firebase Authentication** - Autenticação de usuários
- **Cloud Firestore** - Banco de dados NoSQL
- **Cloud Functions V2** - Serverless backend (Node.js 20)
- **Firebase Hosting** - Hospedagem de múltiplos sites

### Ferramentas de Desenvolvimento
- **Firebase Emulators** - Desenvolvimento local
- **Concurrently** - Execução paralela de scripts
- **ESLint** - Linting
- **Sharp** - Otimização de imagens

---

## 📁 Estrutura do Projeto

```
truestreak/
├── app/                          # Aplicação React principal
│   ├── public/                   # Assets estáticos
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── achievements/     # Sistema de conquistas
│   │   │   ├── common/           # Componentes reutilizáveis
│   │   │   ├── cycle/            # Gerenciamento de ciclos
│   │   │   ├── day/              # Editor de dias
│   │   │   └── workout/          # Sessões de treino
│   │   ├── config/               # Configurações (Firebase, etc)
│   │   ├── constants/            # Constantes e enums
│   │   ├── contexts/             # React Contexts
│   │   ├── hooks/                # Custom hooks
│   │   ├── pages/                # Páginas da aplicação
│   │   ├── styles/               # SCSS global e mixins
│   │   ├── utils/                # Utilitários e helpers
│   │   ├── App.jsx               # Componente raiz
│   │   └── main.jsx              # Entry point
│   ├── .eslintrc.cjs             # Configuração ESLint
│   ├── index.html                # HTML template
│   ├── package.json              # Dependências do app
│   └── vite.config.js            # Configuração Vite
│
├── landing/                      # Landing page do produto
│   ├── public/                   # Build output
│   ├── scripts/                  # Build scripts customizados
│   │   ├── build-html.js         # Minificação HTML
│   │   ├── build-js.js           # Bundle JavaScript
│   │   ├── build-scss.js         # Compilação SCSS
│   │   ├── hash-assets.js        # Cache busting
│   │   ├── optimize-images.js    # Otimização de imagens
│   │   └── watch-*.js            # File watchers
│   ├── src/
│   │   ├── assets/               # Imagens e recursos
│   │   ├── js/                   # JavaScript modular
│   │   ├── styles/               # SCSS modular
│   │   └── index.html            # HTML source
│   └── package.json              # Dependências da landing
│
├── functions/                    # Cloud Functions (Backend)
│   ├── src/
│   │   ├── api/                  # Endpoints da API
│   │   │   ├── achievements.js   # Sistema de conquistas
│   │   │   └── challenges.js     # Cálculo de desafios
│   │   ├── utils/                # Utilitários backend
│   │   │   ├── challengeUtils.js # Lógica de desafios
│   │   │   └── constants.js      # Constantes compartilhadas
│   │   └── index.js              # Exports das functions
│   ├── .eslintrc.js              # Configuração ESLint
│   └── package.json              # Dependências das functions
│
├── .firebaserc                   # Configuração de projetos Firebase
├── firebase.json                 # Configuração Firebase (hosting, functions)
├── firestore.rules               # Regras de segurança Firestore
├── package.json                  # Scripts raiz e concurrently
└── README.md                     # Este arquivo
```

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 20+** (LTS recomendado)
- **npm 10+** ou **yarn 1.22+**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** (para controle de versão)

### Verificar instalações:

```bash
node --version    # v20.x.x ou superior
npm --version     # 10.x.x ou superior
firebase --version # 13.x.x ou superior
```

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/osamucadev/truestreak.git
cd truestreak
```

### 2. Instale as dependências

**Opção A - Instalar tudo de uma vez:**
```bash
# Instala dependências da raiz
npm install

# Instala dependências de todos os subprojetos
cd app && npm install && cd ..
cd landing && npm install && cd ..
cd functions && npm install && cd ..
```

**Opção B - Script automatizado (crie um):**
```bash
# Criar script install-all.sh
chmod +x install-all.sh
./install-all.sh
```

### 3. Configure o Firebase

```bash
# Login no Firebase
firebase login

# Associe ao projeto (se já existir)
firebase use seuprojeto

# OU crie um novo projeto
firebase init
```

### 4. Configure variáveis de ambiente

**App (`app/.env`):**
```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

> **Nota:** Copie as credenciais do Firebase Console → Project Settings → General → Your Apps

---

## 💻 Desenvolvimento

### Rodar o projeto completo

```bash
# Da raiz do projeto
npm start
```

Isso iniciará:
- **App React** em `http://localhost:5174`
- **Landing Page** em `http://localhost:5000`
- **Firebase Emulators**:
  - Auth UI: `http://localhost:4000`
  - Functions: `http://localhost:5001`
  - Firestore: `http://localhost:8080`

### Rodar componentes individualmente

```bash
# Apenas o app React + emulators
npm run dev:app-full

# Apenas o app React
npm run dev:app

# Apenas a landing page
npm run dev:landing

# Apenas os emulators
npm run emulators
```

### Limpar dados dos emulators

```bash
# Remover dados armazenados localmente
rm -rf .firebase/
rm -rf firebase-export-*
rm -rf firebase-emulator-data/

# Reiniciar emulators com dados limpos
npm run emulators:fresh
```

---

## 🏗 Build e Deploy

### Build local

```bash
# Build apenas do app
npm run build:app

# Build apenas da landing
npm run build:landing

# Build de app + landing
npm run build:all
```

### Deploy para produção

**⚠️ Pré-requisito:** O projeto deve estar no plano **Blaze** (pay-as-you-go) para usar Cloud Functions V2.

```bash
# Deploy completo (app + landing + functions)
npm run deploy

# Deploy apenas do app
npm run deploy:app

# Deploy apenas da landing
npm run deploy:landing

# Deploy apenas das functions
npm run deploy:functions
```

### URLs de produção

Após o deploy, os sites estarão disponíveis em:
- **App:** `https://seuprojeto-app.web.app`
- **Landing:** `https://seuprojeto-landing.web.app`

---

## 📜 Scripts Disponíveis

### Scripts Raiz

| Script | Descrição |
|--------|-----------|
| `npm start` | Roda app + landing + emulators simultaneamente |
| `npm run dev:all` | Mesmo que `npm start` |
| `npm run dev:app` | Roda apenas o app React |
| `npm run dev:landing` | Roda apenas a landing page |
| `npm run dev:functions` | Roda apenas as functions nos emulators |
| `npm run dev:app-full` | Roda app + emulators (sem landing) |
| `npm run build:all` | Build de app + landing |
| `npm run deploy` | Deploy completo para produção |
| `npm run deploy:app` | Deploy apenas do app |
| `npm run deploy:landing` | Deploy apenas da landing |
| `npm run deploy:functions` | Deploy apenas das functions |
| `npm run emulators` | Inicia emulators com persistência |
| `npm run emulators:fresh` | Inicia emulators com dados limpos |

### Scripts do App (`cd app`)

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server Vite (localhost:5173) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | Rodar ESLint |

### Scripts da Landing (`cd landing`)

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server com live reload |
| `npm run build` | Build otimizado (minify, hash, sitemap) |
| `npm run serve` | Serve com Firebase (localhost:5000) |

### Scripts das Functions (`cd functions`)

| Script | Descrição |
|--------|-----------|
| `npm run serve` | Roda functions nos emulators |
| `npm run shell` | Shell interativo das functions |
| `npm run deploy` | Deploy das functions |
| `npm run logs` | Ver logs em produção |

---

## 🏛 Arquitetura

### Fluxo de Dados

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ (React Router)
       ▼
┌─────────────────┐
│   React App     │
│  (app/src/)     │
└────────┬────────┘
         │
         │ (Firebase SDK)
         ▼
┌────────────────────────┐
│   Firebase Services    │
│  - Auth                │
│  - Firestore           │
│  - Cloud Functions     │
└────────────────────────┘
```

### Componentes Principais

**App React:**
- `Dashboard` - Página inicial com overview
- `CycleEditor` - Criação/edição de ciclos de treino
- `DayEditor` - Configuração de dias da semana
- `WorkoutSession` - Interface de execução de treino
- `AchievementsPage` - Visualização de conquistas

**Cloud Functions:**
- `calculateChallenges` - Calcula progresso dos desafios
- `getAchievements` - Retorna conquistas do usuário
- Triggered functions para atualização automática

**Firestore Collections:**
```
users/{userId}
  - achievements (subcollection)
  - workoutCycles (subcollection)
  - workoutSessions (subcollection)
```

---

## 💡 Filosofia do Produto

### Princípios Fundamentais

**1. Dias difíceis não apagam o teu progresso**
- Pausas não resetam streaks
- Histórico completo sempre visível
- Retorno facilitado após ausências

**2. Todo seu esforço deve ser recompensado**
- Cada treino gera progresso real
- Conquistas refletem dedicação
- Pequenas vitórias são celebradas

**3. Gamificação como ferramenta, não como fim**
- Foco na validação do esforço
- Sem competição ou comparação
- Reconhecimento do processo, não só do resultado

### Design Principles

- **Acessibilidade**: Suporte a `prefers-reduced-motion`, contraste adequado
- **Performance**: Lazy loading, code splitting, otimização de imagens
- **Responsividade**: Mobile-first, adaptação a todos os tamanhos de tela
- **Feedback visual**: Animações suaves, estados claros, celebrações visuais

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Samuel Caetité**

- GitHub: [@osamucadev](https://github.com/osamucadev)
- Email: srcaetite@gmail.com

---

## 🙏 Agradecimentos

- Comunidade React pela excelente documentação
- Firebase pela plataforma robusta
- Todos que testaram e deram feedback durante o desenvolvimento

---

**Feito com 💜 por Samuel Caetité**