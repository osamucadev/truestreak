# TrueStreak - Questões de Clarificação

## 📋 Contexto

Após análise do seu documento de escopo, surgiram algumas contradições e pontos que precisam ser esclarecidos para garantir que o desenvolvimento siga exatamente sua visão. Responda cada questão abaixo.

---

## 1. Timer de Descanso - Contradição

### Situação:
- Na questão **3.2** você respondeu: *"Ao invés de timer, o que acha de um cronômetro? Aí deixa o usuário contabilizar por si só. Sem ser algo super fixo."*
- Na questão **3.3** você respondeu: *"Timer regressivo, com botões rápidos de +30s e 'pular'."*

### Pergunta:
**Qual é a solução definitiva?**

**Opção A - Cronômetro (conta pra cima):**
- Você aperta "iniciar" e ele começa contar: 0s → 10s → 30s → 90s...
- Você para quando quiser
- Não tem alarme nem limite

**Opção B - Timer regressivo (conta pra baixo):**
- Você define 90s e ele conta: 90s → 60s → 30s → 0s → ALARME
- Pode adicionar +30s ou pular antes de terminar
- Tem alarme quando chega a zero

**Opção C - Híbrido/Ambos:**
- Usuário escolhe qual prefere nas configurações

### Sua resposta:
```
Vamos deixar essa questão de timer/cronômetro para depois. Esqueça isso por enquanto, pois isso é a perfumaria da perfumaria.
```

---

## 2. Treino Livre na Sequência - Funcionamento Prático

### Cenário 1 - Livre faz parte da sequência linear:
```
Dia 1: A (obrigatório)
Dia 2: Livre - Pump (opcional)
Dia 3: B (obrigatório)
Dia 4: Livre - Cardio (opcional)
Dia 5: A (obrigatório)
...
```

**Neste caso:**
- Se pulo o Livre do dia 2, no dia 3 já aparece B automaticamente?
- O app "sabe" que era dia de livre e passou direto pro próximo obrigatório?

---

### Cenário 2 - Livre é paralelo à sequência:
```
Sequência principal: A → B → A → B → A → B...
Livres: sugeridos em "dias de descanso", mas não fazem parte da ordem linear
```

**Neste caso:**
- O app sugere livre quando o dia atual NÃO é dia de obrigatório?
- Como o sistema sabe quando sugerir livre vs quando sugerir obrigatório?

---

### Cenário 3 - Outro modelo:
Se nenhum dos dois acima representa sua visão, descreva como funciona.

---

### Sua resposta:
```
Esqueça a ideia de semana, a abordagem aqui é de ciclo (lembre que terão dias que eu não quero ir e tem dias que eu não poderei ir, mesmo querendo, por isso não é para se apegar em dias). O objetivo é o usuário cadastrar seu ciclo de treinos. Terão ciclos que serão compostos apenas por treinos obrigatórios, como A -> B -> C -> A -> B -> C e por aí vai e terão ciclos que terão dias de descanso. O que eu quero com o TrueStreak é fazer com que esses dias de descanso no sistema apareçam como dias de treino livre com alguma sugestão do que fazer naquele dia (lembre-se, aqui o foco não é só no físico, é no mental também, e tem pessoas com algum transtorno que não podem ficar um dia sequer parado). Se o usuário comparece num dia de treino livre, ele ganha estamina e um XPzinho reduzido em comparação aos dias obrigatórios. Se ele não for, nada acontece e segue a sequência no outro dia.

O objeto que representa cada treino é algo assim (está na versão 1, na versão dois vamos cadastrar o número de repetições)

{
    key: "A",
    title: "Treino A — Parte de cima",
    isMandatory: true,
    exercises: [
      {
        name: "Supino reto com barra",
        setsReps: "3–4 x 6–10",
        helps:
          "Peito (espessura), tríceps e ombro anterior. Base estética do tronco.",
        steps: [
          "Ajuste o banco e deite com os olhos alinhados abaixo da barra.",
          "Plante os pés firmes no chão e faça uma leve 'ponte' natural no peito (sem tirar o glúteo do banco).",
          "Retrate as escápulas (junte e desça os ombros) para estabilizar as costas no banco.",
          "Pegue a barra com pegada um pouco mais aberta que os ombros.",
          "Tire a barra do suporte e desça controlando até tocar levemente o meio do peito.",
          "Empurre a barra para cima em linha reta, mantendo punhos neutros e controle total.",
        ],
        tips: [
          "Pensa em 'dobrar a barra' (ativar dorsais) pra proteger o ombro.",
          "Evite cotovelos 100% abertos; deixe em ~45–70° do tronco.",
          "Controle a descida (2–3s) e suba firme sem quicar no peito.",
        ],
      },
      {
        name: "Puxada na frente (pulldown) pegada aberta",
        setsReps: "3–4 x 8–12",
        helps: "Costas (largura) e postura. Ajuda no formato em V.",
        steps: [
          "Ajuste o assento/apoio de coxas para travar bem as pernas.",
          "Segure a barra com pegada aberta e sente com peito alto.",
          "Antes de puxar, 'abaixe os ombros' (depressão escapular) como se colocasse eles no bolso.",
          "Puxe a barra em direção à parte alta do peito, trazendo cotovelos para baixo e para os lados.",
          "Pare quando a barra chegar perto do peito sem perder postura.",
          "Suba controlando até quase estender os braços, mantendo tensão nas costas.",
        ],
        tips: [
          "Não puxe com o bíceps; pense em cotovelos descendo.",
          "Evite jogar o corpo muito pra trás; leve inclinação ok.",
          "Segura 1s embaixo 'abrindo o peito'.",
        ],
      },
      {
        name: "Supino inclinado com halteres (~30°)",
        setsReps: "3 x 8–12",
        helps: "Peito superior e estética em ângulo (camiseta cai melhor).",
        steps: [
          "Ajuste o banco em ~30° (leve inclinação).",
          "Sente com os halteres nas coxas e deite levando-os ao peito.",
          "Fixe escápulas no banco e mantenha peito aberto.",
          "Inicie com halteres acima do peito/ombros, punhos neutros.",
          "Desça controlando até sentir alongar o peitoral (cotovelos abaixo da linha do ombro, sem exagero).",
          "Suba empurrando e aproximando levemente os halteres, sem bater um no outro.",
        ],
        tips: [
          "Banco muito alto vira ombro — mantenha ~30°.",
          "Desça devagar e não deixe o cotovelo “fugir” pra trás demais.",
          "Pensa em 'abraçar a barra do ar' pra ativar peito.",
        ],
      },
      {
        name: "Remada baixa no cabo",
        setsReps: "3 x 10–12",
        helps: "Costas (espessura) e escápulas fortes (postura).",
        steps: [
          "Sente na máquina e apoie os pés na plataforma.",
          "Segure o triângulo/pegador e mantenha coluna neutra (peito alto).",
          "Comece com braços estendidos e ombros 'no lugar' (sem deixar ir pra frente demais).",
          "Puxe o cabo até a região do abdômen (linha do umbigo), trazendo cotovelos para trás.",
          "No final, 'esprema' as escápulas sem jogar o tronco pra trás.",
          "Volte controlando até estender, mantendo tensão (não largue).",
        ],
        tips: [
          "Evite balançar o corpo; o movimento vem das costas.",
          "Cotovelos perto do corpo = mais dorsal.",
          "Pausa 1s no final ajuda muito na conexão.",
        ],
      },
      {
        name: "Elevação lateral com halteres",
        setsReps: "4 x 12–15",
        helps: "Ombro lateral: o exercício mais direto pro 'shape largo'.",
        steps: [
          "Fique em pé com pés na largura do quadril e core firme.",
          "Pegue dois halteres e deixe-os ao lado do corpo.",
          "Mantenha cotovelos levemente flexionados e punhos neutros.",
          "Eleve os braços para os lados até a altura dos ombros (sem passar muito).",
          "Pausa curta no topo sem encolher ombros.",
          "Desça devagar controlando até quase encostar os halteres no corpo.",
        ],
        tips: [
          "Pensa em 'abrir os braços' e não em 'levantar com a mão'.",
          "Ombros longe das orelhas (não encolher).",
          "Menos carga + mais controle = mais deltoide, menos trapézio.",
        ],
      },
      {
        name: "Rosca direta (barra ou halteres)",
        setsReps: "3 x 8–12",
        helps: "Bíceps cheio e mais volume no braço (visual imediato).",
        steps: [
          "Fique em pé com postura alta e core firme.",
          "Segure a barra/halteres com pegada supinada (palmas pra cima).",
          "Trave os cotovelos ao lado do tronco (sem ir pra frente).",
          "Suba até perto do peito contraindo o bíceps, sem balançar o corpo.",
          "Segure 1s no topo.",
          "Desça controlando até quase estender totalmente.",
        ],
        tips: [
          "Se o tronco balança, a carga está alta demais.",
          "Controle a descida (2–3s) pra crescer mais.",
          "Punhos neutros (não quebrar demais).",
        ],
      },
      {
        name: "Tríceps corda no pulley",
        setsReps: "3 x 10–15",
        helps: "Tríceps (parte de trás do braço): dá tamanho e acabamento.",
        steps: [
          "Ajuste a polia alta com corda e fique em pé, leve inclinação do tronco.",
          "Segure a corda com pegada neutra e cotovelos colados ao corpo.",
          "Comece com antebraços dobrados, corda próxima ao peito.",
          "Empurre para baixo estendendo os cotovelos até o final.",
          "No fim, abra as pontas da corda para fora (separando) e contraia o tríceps.",
          "Suba controlando sem deixar o cotovelo abrir.",
        ],
        tips: [
          "Cotovelos não passeiam — ficam fixos.",
          "Abra a corda só no final (acabamento).",
          "Evite usar o ombro pra roubar o movimento.",
        ],
      },
    ],
  },
```

---

## 3. Sistema de Stamina - Mecânica

### Você disse:
*"Fazer o treino livre gera stamina (uma espécie de multiplicador de XP para eu subir de Level mais rápido)"*

### Pergunta:
**Como a Stamina funciona exatamente?**

**Opção A - Barra que enche:**
- Cada treino livre enche 20% da barra de Stamina
- Quando chega a 100%, próximo treino obrigatório dá XP dobrado
- Stamina reseta após usar

**Opção B - Multiplicador temporário:**
- Cada treino livre dá +10% de XP no próximo treino obrigatório
- Acumula até 50% (5 treinos livres)
- Decai com o tempo ou após usar

**Opção C - Recurso acumulável:**
- Cada treino livre = 1 Stamina
- Posso gastar Stamina para boostar XP de treinos
- Ex: 3 Staminas = +50% XP no próximo treino

**Opção D - Outro modelo:**
Descreva sua visão.

### Sua resposta:
```
Eu gosto do B
```

---

## 4. Conquistas com Níveis - Sistema de Progressão

### Você disse:
*"Para as conquistas que eu poderia ganhar mais de uma vez, eu quero ter a possibilidade de ganhar mais de uma vez, fazendo com que essa conquista aumente de nível, pois depois eu vou querer ter rankings para essas conquistas, como ferro, bronze, prata, ouro, platina, turmalina, alexandrita, esmeralda, rubi, diamante..."*

### Pergunta:
**Como funciona a progressão de níveis?**

**Modelo A - Por repetições da mesma meta:**
- Conquista: "Primeira Semana" (7 dias de streak)
- 1ª vez que consigo 7 dias = **Ferro**
- 2ª vez que consigo 7 dias = **Bronze**
- 3ª vez que consigo 7 dias = **Prata**
- 10ª vez = **Diamante**

**Modelo B - Por tamanho crescente da meta:**
- 7 dias de streak = **Ferro**
- 14 dias de streak = **Bronze**
- 30 dias de streak = **Prata**
- 50 dias de streak = **Ouro**
- 100 dias de streak = **Platina**
- 200 dias de streak = **Turmalina**
- ...
- 1000 dias = **Diamante**

**Modelo C - Híbrido ou outro:**
Descreva sua visão.

### Sua resposta:
```
Por enquanto eu gosto da B. Se tiver alguma outra sugestão, estou aceitando.
```

---

## 5. Insights Automáticos - O que você quer?

### Você mencionou:
*"Sistema de insights textuais automáticos (tipo 'mini IA' baseada em regras)."*

### Pergunta:
**Que tipo de insights você imagina?**

**Exemplos que imaginei:**

**Insights de celebração:**
- *"Você treinou 4x essa semana, seu melhor desde março! 🔥"*
- *"Sua streak atual já é maior que as últimas 3 combinadas"*
- *"Você não marca 'não quero' há 2 meses. Consistência impressionante."*

**Insights de padrões:**
- *"Você sempre treina mais nas terças e quintas"*
- *"Seu maior streak sempre quebra aos domingos"*

**Insights de sugestão:**
- *"Você não faz treino livre há 10 dias. Que tal um pump leve?"*
- *"Faz 3 semanas que não marca 'não posso'. Corpo está respondendo bem!"*

**Insights de motivação:**
- *"Você já voltou 5x depois de quebrar streak. Isso é resiliência de verdade."*

### Sua resposta:
**Quais desses você quer? Tem outros tipos de insight que imagina?**
```
Gostei de todas essas. Dá pra fazer isso no código JS? Tem alguma outra sugestão de como calcular isso?
```

---

## 6. Ciclo Personalizado - Exemplo Real

### Pergunta:
**Me dê um exemplo de ciclo completo que VOCÊ usaria no dia a dia.**

**Estrutura sugerida:**
```
Dia 1: [Nome do Treino] - [Tipo: Obrigatório/Livre] - [Descrição breve]
Dia 2: ...
Dia 3: ...
...
```

**Exemplo fictício para ilustrar:**
```
Dia 1: A - Upper Pesado (Obrigatório) - Peito, costas, ombro com carga
Dia 2: Livre - Pump + Cardio (Opcional) - Braço, peito leve, 15min esteira
Dia 3: B - Lower Pesado (Obrigatório) - Agachamento, terra, leg press
Dia 4: Descanso (nenhum treino sugerido)
Dia 5: A - Upper Moderado (Obrigatório) - Mesmo de D1 mas volume menor
Dia 6: Livre - Cardio + Core (Opcional) - Mobilidade e condicionamento
Dia 7: B - Lower Moderado (Obrigatório) - Mesmo de D3 mas volume menor
```

### Sua resposta:
**Descreva SEU ciclo ideal:**
```
O meu é esse aí de 7 dias exatamente como vc colocou. Mas esse é o meu, cada usuário vai poder cadastrar/editar seu ciclo. Ele pode ser AB + 2 dias livres, ou ABC sem dia livre. O usuário que decide. Acho que o mais legal é ter uma área de edição em que o usuário cadastra dia, no dia ele coloca os exercícios que tem que ser feitos e marca se é dia livre ou não.
```

---

## 7. "Não Posso" vs "Dia Neutro" - Diferença Prática

### Situação:
- **Dia Neutro** = Não marquei nada. Invisível no heatmap, não quebra streak, não aparece em lugar nenhum.
- **"Não Posso"** = Marquei explicitamente. Aparece no heatmap (cor leve), não quebra streak, fica registrado.

### Pergunta:
**Por que eu escolheria marcar "Não Posso" em vez de simplesmente deixar o dia neutro?**

**Possíveis razões:**
- A) Pra ter registro visual de que "estava impedido" (diferente de esquecimento)
- B) Pra insights futuros ("você teve 3 imprevistos esse mês")
- C) Pra honestidade consigo mesmo (reconhecer limitação ≠ ignorar)
- D) Outra razão

**E quando eu usaria cada um?**

**Exemplo de "Não Posso":**
- Academia fechou por feriado
- Fiquei doente
- Viagem de trabalho

**Exemplo de "Dia Neutro":**
- Simplesmente não fui e não quis registrar motivo
- Esqueci de marcar
- ???

### Sua resposta:
```
A ideia do app é ser leve e fazer o usuário ter um compromisso consigo mesmo. Não é para ser um microgerenciador que fica ali em cima do usuário cobrando coisas. Vai que eu estou num dia tão ruim da minha depressão que eu resolvo não fazer nada nesse dia, só ficar na cama chorando; nesse caso, imagino que não seja de bom tom punir de alguma forma o usuário por conta do seu transtorno, ele já está mal iternamente demais, não precisa de mais algo externo o fazendo ficar pior e lembrando que ele está "errando". Para isso existem os dias que não quero ir (mesmo podendo), os dias que não posso ir (mesmo querendo) e os dias neutros, na qual os dois primeiros eu mantenho um compromisso comigo conscientemente de registrar as coisas e no último aí o sistema "finge que não viu", pois entende que o usuário está mal demais e prefere ignorar para não deixar o usuário pior.
```

---

## 📌 Observações Finais

**Alguma outra contradição ou ponto que você percebeu que precisa esclarecer?**

```
Por enquanto não
```

---

**Data de preenchimento:** ___/___/___  
**Versão do documento:** 1.1 - Clarificações