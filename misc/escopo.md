# TrueStreak - Definição de Escopo v2.0

## 📋 Contexto

Este documento contém todas as questões levantadas durante a discussão de escopo do TrueStreak. Preencha cada seção com suas respostas para refinamento do projeto.

---

## 1. Treinos Obrigatórios vs Treinos Livres

### 1.1 Impacto na sequência

**Pergunta:** Treino livre quebra a sequência dos obrigatórios?  
**Exemplo:** Se estou em A → B → C e faço um treino livre, volto pro A ou continuo esperando fazer o B?

**Sua resposta:**

```
A ideia dos treinos livres é serem treinos de respiro que podem ser feitos em dias de descanso, mas que são opcionais. Por exemplo: vamos dizer que meu personal fez um treino pra mim que é A num dia, B no outro e no terceiro dia eu deveria descansar (ou seja, não ir à academia) e aí no quarto dia eu volto ao A e assim repete o ciclo; o treino livre entra aqui como se fosse uma sugestão de algo para fazer caso eu queira nesse dia de decanso fazer alguma atividade física. A ideia é que o sistema sugira para cada dia livre uma sequência de exercícios, mas nada que seja obrigatório. Fazer o treino livre gera stamina (uma espécie de multiplicador de XP para eu subir de Level mais rápido - essa coisa de level acabou de me surgir aqui e acho que é uma ideia a se pensar). Ah, caso hoje seja dia do treino livre e amanha o dia de A e eu não vá hoje, amanhã o sistema já sugere o treino A e segue sem nenhum tipo de coisa negativa, pois o treino livre é só para ser um reforço positivo: se eu for, ótimo e eu ganho algo positivo em troca, se eu não for, nada acontece.
```

---

### 1.2 Treino livre e streak

**Pergunta:** Treino livre conta para streak?

**Sua resposta:**

```
Sim, treino livre conta para a streak, pois representa constância real de movimento. Porém, ele não tem o mesmo peso simbólico nem estrutural que um treino obrigatório. A streak representa “voltar e se mover”, não apenas cumprir protocolo.
```

---

### 1.3 Sistema de XP

**Pergunta:** Treino livre dá XP? Se sim, quanto em relação ao obrigatório?  
**Sugestão atual:** Obrigatório = 100 XP, Livre = 50-70 XP

**Sua resposta:**

```
Treino obrigatório dá 100 XP fixos.
Treino livre dá 60 XP.
A diferença reforça que o livre é bônus e cuidado, não substituto do estímulo principal.
```

---

### 1.4 Cenário "só treinos livres"

**Pergunta:** Se eu fizer APENAS treinos livres por 7 dias consecutivos, o que acontece?

- Streak sobe normalmente?
- Sequência A→B→C fica parada?
- Isso é permitido ou há algum tipo de alerta/incentivo?

**Sua resposta:**

```
A ideia é que o treino livre seja cadastrado fazendo parte da sequência como um todo, mas ele não é obrigatório. Na v2, não é para deixar ser possível eu marcar que fiz treino livre no dia de treino obrigatório e nem o contrário.
```

---

### 1.5 Visualização no Heatmap

**Pergunta:** Como diferenciar visualmente treinos obrigatórios de livres no heatmap?  
**Sugestão atual:** Cores diferentes (azul = obrigatório, verde = livre)

**Sua resposta:**

```
Sim. A ideia é que o heatmap deixe de ser um placar de desempenho e passe a ser um retrato honesto do que aconteceu, sem julgamento embutido. Em vez de esconder tudo que não é treino, o mapa pode mostrar cada tipo de dia de forma diferente, comunicando intenção e contexto. Dias com treino obrigatório aparecem com mais força visual, porque representam o estímulo principal e o avanço real do processo. Dias de treino livre também aparecem, mas de forma mais suave, sinalizando cuidado e movimento sem competir com o treino base. Dias marcados como “não quero” aparecem com uma cor de ausência consciente, desaturada e leve, deixando claro que houve uma decisão de não treinar, sem carregar um peso punitivo. Dias marcados como “não posso” aparecem com outra tonalidade igualmente leve, mas que comunica impossibilidade real, algo que o sistema reconhece e respeita. Já os dias neutros simplesmente não aparecem: eles não carregam informação suficiente para serem interpretados e, por isso, permanecem silenciosos no mapa. Assim, o heatmap deixa de julgar e passa a contar a história real do usuário, distinguindo ação, escolha, limite e silêncio de forma visualmente clara e emocionalmente justa.
```

---

## 2. Estrutura e Criação de Treinos

### 2.1 Nomenclatura dos treinos

**Pergunta:** Cada letra do ciclo tem nome personalizável?  
**Exemplo:** "A - Peito/Costas Pesado", "B - Perna Pesado", "C - Upper Moderado"

**Sua resposta:**

```
Sim. Cada treino do ciclo tem nome personalizável, com letra como identificador lógico e nome descritivo para o usuário.
```

---

### 2.2 Lista de exercícios

**Pergunta:** Cada treino tem lista de exercícios configurável pelo usuário?  
**Exemplo:**

- Supino 4x8-10
- Remada curvada 4x8-10
- Desenvolvimento 3x10-12

**Sua resposta:**

```
Sim. Cada treino tem lista de exercícios configurável pelo usuário. O app pode sugerir exercícios padrão, mas o controle final é do usuário.
```

---

### 2.3 Intensidades no mesmo ciclo

**Pergunta:** Posso ter o mesmo grupo muscular com intensidades diferentes no ciclo?  
**Exemplo:** Dia 1 = A-pesado, Dia 4 = A-moderado (ambos no mesmo ciclo)

**Sua resposta:**

```
Sim. O mesmo grupo muscular pode aparecer mais de uma vez no ciclo com intensidades diferentes (ex: A pesado e A moderado). Para o sistema, são treinos distintos, mesmo que compartilhem letra-base.
```

---

### 2.4 Templates prontos (Onboarding)

**Pergunta:** Quer oferecer templates prontos no primeiro uso para facilitar?  
**Exemplos:**

- "Iniciante - A/B Simples"
- "Intermediário - ABCD"
- "Avançado - Seu exemplo da semana"
- "Personalizado - criar do zero"

**Sua resposta:**

```
Sim. Templates prontos são essenciais no onboarding para reduzir fricção inicial. Deve existir opção de escolher template ou criar do zero.
```

---

## 3. Sistema de Marcação Durante o Treino

### 3.1 Granularidade da marcação

**Pergunta:** Quer marcar série por série OU exercício completo de uma vez?

**Opção A - Série por série:**

- Supino 4x8 → você marca: ✅ série 1, ✅ série 2, ✅ série 3, ✅ série 4

**Opção B - Exercício completo:**

- Supino 4x8 → você marca: ✅ Supino (tudo de uma vez)

**Sua resposta:**

```
Opção B — marcar exercício completo. Série por série gera fricção excessiva no início.
```

---

### 3.2 Timer de descanso - Tipo

**Pergunta:** Timer fixo, configurável ou ambos?

**Opções:**

- Fixo global (ex: sempre 90s para todos exercícios)
- Configurável por exercício (Supino = 120s, Rosca = 60s)
- Padrão + ajustável na hora (começa em 90s, mas você pode mudar durante)

**Sua resposta:**

```
Ao invés de timer, o que acha de um cronômetro? Aí deixa o usuário contabilizar por si só. Sem ser algo super fixo.
```

---

### 3.3 Timer de descanso - Comportamento

**Pergunta:** Cronômetro (conta pra cima) OU Timer regressivo (conta pra baixo)?

**Minha sugestão:** Timer regressivo com opção de +30s ou pular se precisar

**Sua resposta:**

```
Timer regressivo, com botões rápidos de +30s e “pular”.
```

---

### 3.4 Notificação sonora/vibração

**Pergunta:** Quer som/vibração quando o timer de descanso terminar?

**Sua resposta:**

```
Não. Só depois vamos ver isso!
```

---

### 3.5 Persistência de progresso

**Pergunta:** Se você sair no meio do treino (fechar app, travar, etc), o progresso é salvo?  
**Exemplo:** Fez 3 exercícios de 6, saiu do app → ao voltar, continua de onde parou?

**Sua resposta:**

```
Sim. Progresso do treino em andamento deve ser salvo automaticamente.
```

---

## 4. Edição de Treinos

### 4.1 Edição pós-histórico

**Pergunta:** Se eu já tenho 50 treinos registrados e edito o "Treino A" (mudo exercícios), o que acontece?

**Opções:**

- Afeta apenas próximos treinos (histórico preservado)
- Permite editar retroativamente (arriscado)
- Cria "versão 2" do treino

**Sua resposta:**

```
Editar afeta apenas treinos futuros. Histórico permanece como foi executado. Se necessário, cria-se uma “versão” interna do treino.
```

---

### 4.2 Exclusão de treinos do ciclo

**Pergunta:** Posso remover um treino do ciclo? (ex: tinha ABCD, agora quero só ABC)  
Se sim, o que acontece com o histórico daquele treino?

**Sua resposta:**

```
Pode remover do ciclo. O histórico permanece, mas o treino deixa de ser usado na progressão futura.
```

---

## 5. Sistema de Conquistas/Troféus

### 5.1 Categorias de conquistas

**Pergunta:** Quais categorias fazem sentido pra você?

**Sugestões atuais:**

- ✅ Constância (streaks, total de treinos)
- ✅ Honestidade (usar "não posso", treinos livres)
- ✅ Resiliência (voltar após quebrar streak)
- ✅ Técnicas (completar todos exercícios, pontualidade no timer)

**Você quer adicionar/remover alguma categoria?**

**Sua resposta:**

```
Manter as quatro categorias propostas. Todas fazem sentido com a filosofia do app.
```

---

### 5.2 Notificação de conquista

**Pergunta:** Como você quer descobrir que ganhou uma conquista?

**Opções:**

- Popup/modal celebrando na hora
- Notificação discreta (toastify)
- Badge com "novo" na área de troféus
- Combinação (popup + fica marcado como novo)

**Sua resposta:**

```
Combinação: popup celebrando na hora + badge marcado como novo na área de troféus.
```

---

### 5.3 Conquistas sugeridas

**Pergunta:** Das conquistas que sugeri, quais você CERTAMENTE quer na v1.0?

**Constância:**

- [x] "Primeira Semana" - 7 dias de streak
- [ ] "Mês de Ferro" - 30 dias de streak
- [x] "Centurião" - 100 treinos totais
- [ ] "Inabalável" - Maior streak de 50 dias

**Honestidade:**

- [x] "Respeito aos Limites" - Marcar "não posso" 5x
- [x] "Cuidado Próprio" - 10 treinos livres
- [ ] "Leveza" - 1 semana só com treinos livres

**Resiliência:**

- [X] "Recomeço" - Voltar após quebrar streak
- [ ] "Resiliência" - Quebrar e reconstruir 3x
- [X] "Mais Forte Que Antes" - Streak maior pós-quebra

**Técnicas:**

- [X] "Completista" - Marcar todos exercícios
- [ ] "Pontual" - 10 treinos respeitando timer
- [X] "Equilibrado" - Completar ciclo inteiro

**Marque com X as que você quer OU adicione outras:**

**Sua resposta:**

```
Para as conquistas que eu poderia ganhar mais de uma vez (por exemplo: 7 dias de treinos consecutivos), eu quero ter a possibilidade de ganhar mais de uma vez, fazendo com que essa conquista aumente de nível, pois depois eu vou querer ter rankings para essas conquistas, como ferro, bronze, prata, ouro, platina, turmalina, alexandrita, esmeralda, rubi, diamante...
```

---

## 6. Autenticação e Dados

### 6.1 Sistema de Login

**Pergunta:** Login é obrigatório ou opcional?

**Opções:**

- Obrigatório (Firebase Auth desde o início)
- Opcional (modo offline com localStorage + opção de criar conta pra sync)
- Híbrido (começa offline, depois pode fazer upgrade pra conta)

**Sua resposta:**

```
Híbrido (começa offline, depois pode fazer upgrade pra conta). A ideia é que na landing page tenha um botão para criar treino e um para login (pode ter outros, mas aqui importa só esses dois). Ao clicar em criar, vai ter uma página falando que pode criar offline e um aviso que só vai funcionar naquele dispositivo e também a opção de fazer login para ter sincronização com vários dispositivos.
```

---

### 6.2 Métodos de autenticação

**Pergunta:** Se tiver login, quais métodos?

**Opções:**

- [ ] Email/Senha
- [X] Google
- [ ] Apple (se for PWA/mobile)
- [X] Anônimo (Firebase Anonymous Auth)

---

### 6.3 Sync entre dispositivos

**Pergunta:** Usuário pode acessar de celular E desktop com dados sincronizados?

**Sua resposta:**

```
Sim, quando autenticado.
```

---

### 6.4 Backup e recuperação

**Pergunta:** Sistema de backup automático ou manual?

**Opções:**

- Auto (Firebase salva tudo automaticamente)
- Manual (botão "fazer backup" que exporta JSON)
- Ambos

**Sua resposta:**

```
Ambos. Backup automático via conta + export manual em JSON.
```

---

## 7. Features Extras / Nice to Have

### 7.1 Escudo de Streak

**Pergunta:** Quer algum tipo de "escudo" que protege a streak 1x por mês?  
**Exemplo:** Você pode quebrar streak 1x sem perder, como um "perdão"

**Sua resposta:**

```
Não. Vai contra a filosofia de honestidade do TrueStreak.
```

---

### 7.2 Modo Escuro/Claro

**Pergunta:** Além do glassmorphism, quer toggle de tema dark/light?

**Sua resposta:**

```
Sim. Glassmorphism claro e escuro.
```

---

### 7.3 PWA (Progressive Web App)

**Pergunta:** Quer que funcione offline e possa ser "instalado" no celular como app?

**Sua resposta:**

```
Sim. Offline-first é essencial.
```

---

### 7.4 Notificações Push

**Pergunta:** Quer notificações? (ex: "Você não treina há 2 dias", "Streak de 10 dias!")

**Se sim, qual tipo:**

- [X] Lembrete de treino (horário configurável)
- [X] Celebração de conquistas
- [ ] Alerta de streak em risco
- [ ] Nenhuma (filosofia anti-pressão)

**Sua resposta:**

```
Apenas celebração de conquistas e lembretes suaves. Nada de alerta de culpa.
```

---

### 7.5 Estatísticas avançadas

**Pergunta:** Quer gráficos de evolução? (ex: treinos por semana, XP ao longo do tempo)

**Sua resposta:**

```
Sim, mas pós-MVP.
```

---

## 8. Priorização de Versões

### 8.1 MVP (v1.0) - O que PRECISA ter no lançamento?

**Marque com X ou liste:**

```
Sequência A/B + livres

DONE / NÃO QUERO / NÃO POSSO

Streak verdadeira

Histórico

Heatmap

Conquistas básicas

Offline-first
```

---

### 8.2 v1.5 - Primeira atualização importante

**O que vem logo depois do MVP?**

```
Edição avançada de treinos

Estatísticas visuais

Melhorias de insight automático
```

---

### 8.3 v2.0 - Visão de longo prazo

**Features dos sonhos (mas não essenciais no início):**

```
Compartilhamento de conquistas (ex: geração de imagem vertical para story do instagram)
```

---

## 9. Landing Page

### 9.1 Mensagem principal

**Pergunta:** Qual deve ser o HOOK principal da landing?

**Sugestões:**

- "Constância Real. Sem Culpa."
- "O app de treino que não te pune por ser humano"
- "True Streak. True Progress."

**Sua resposta:**

```
“O app de treino que não te pune por ser humano.”, embora eu tenha gostado do True Streak True Progress.
```

---

### 9.2 Conteúdo da landing

**Pergunta:** O que ela precisa ter?

**Sugestões:**

- [ ] Hero com CTA
- [ ] Explicação da filosofia (dias neutros, querer vs poder)
- [ ] Comparação com outros apps
- [ ] Depoimento pessoal (anônimo ou não)
- [ ] Screenshots do app
- [ ] FAQ
- [ ] Rodapé com contato/redes

**Adicione outros elementos:**

**Sua resposta:**

```
Hero, filosofia, comparação com apps tradicionais, depoimento pessoal, screenshots, FAQ.
```

---

## 10. Observações Gerais

**Alguma feature que você quer e eu não mencionei?**

```
Sistema de insights textuais automáticos (tipo “mini IA” baseada em regras).
```

---

**Alguma preocupação técnica ou de UX que você tem?**

```
Evitar excesso de fricção e microgerenciamento.
```

---

**Data de preenchimento:** 27/12/2025

**Versão do documento:** 1.0
