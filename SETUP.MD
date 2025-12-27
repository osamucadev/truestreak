# 🚀 Como Rodar Localmente

## Primeira vez? Instale as dependências:

### 1. App Web
```bash
cd app
npm install
```

### 2. Cloud Functions
```bash
cd functions
npm install
```

---

## 🔥 Rodando em Desenvolvimento

### App Web (React)
```bash
cd app
npm start
```
Acesse: http://localhost:5174

### Cloud Functions (Emulador)
```bash
cd functions
npm start
```
Functions disponíveis em: http://localhost:4000

---

## ✅ Checklist

- [ ] Node.js instalado (v18+)
- [ ] npm instalado
- [ ] Firebase CLI instalado (`npm install -g firebase-tools`)
- [ ] Dependências do app instaladas (`cd app && npm install`)
- [ ] Dependências das functions instaladas (`cd functions && npm install`)

---

## 📦 Estrutura

```
truestreak/
├── app/              # App web (React + SCSS)
└── functions/        # Backend (Cloud Functions)
```

---

**Dúvidas?** Leia a documentação em `docs/`