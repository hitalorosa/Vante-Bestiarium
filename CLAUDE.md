# CLAUDE.md — Instruções de Trabalho

> Este arquivo é lido automaticamente pelo Claude Code a cada sessão.
> Ele define o fluxo obrigatório de trabalho com Git, GitHub e Vercel para este projeto.

---

## 🤖 Inicialização Automática — Leia isso primeiro

Ao abrir um projeto com este `CLAUDE.md`, siga esta lógica:

**SE os campos `Framework` e `Repositório GitHub` estiverem como `[PREENCHER]`:**
1. Informe ao usuário que identificou um projeto novo ainda não configurado
2. Faça as seguintes perguntas antes de qualquer outra ação:
   - "Qual é o nome do projeto?"
   - "Qual framework vamos usar? (Next.js, React, HTML/CSS, Astro, outro)"
   - "Já criamos o repositório no GitHub? Se sim, qual a URL?"
3. Com as respostas, preencha automaticamente os campos `[PREENCHER]` neste arquivo usando as informações coletadas
4. Confirme ao usuário que o `CLAUDE.md` foi atualizado e o projeto está pronto para começar

**SE os campos já estiverem preenchidos:**
1. Leia as informações silenciosamente
2. Confirme apenas: "Projeto [nome] carregado. Framework: [framework]. Pronto para trabalhar."
3. Aguarde a instrução do usuário para iniciar

---

## 🚀 Stack e Deploy

- **Hospedagem:** Vercel (integração automática com GitHub)
- **Branch de produção:** `main` → deploy automático no site ao vivo
- **Branches de feature:** qualquer outro branch → gera URL de preview automática na Vercel
- **Framework:** HTML / CSS / JavaScript Vanilla (sem frameworks)
- **Repositório GitHub:** https://github.com/hitalorosa/Vante-Bestiarium

---

## ⚠️ Regra Fundamental

**Nunca editar diretamente na `main`.**

Toda alteração, por menor que seja, deve passar pelo fluxo de branches abaixo.
A `main` só recebe código via Pull Request revisado e aprovado.

---

## 🔄 Fluxo Obrigatório de Trabalho

### 1. Antes de começar qualquer tarefa — partir da main atualizada

```bash
git checkout main
git pull origin main
```

### 2. Criar o branch com prefixo correto

```bash
git checkout -b tipo/descricao-curta
```

Prefixos disponíveis:

| Prefixo | Quando usar |
|---|---|
| `feature/` | Nova funcionalidade ou seção |
| `fix/` | Correção de bug ou erro |
| `style/` | Mudança visual sem lógica |
| `content/` | Atualização de texto, imagem ou conteúdo |
| `config/` | Alteração de configuração (vercel.json, env, etc.) |
| `refactor/` | Reorganização de código sem mudança de comportamento |

Exemplos:
```bash
git checkout -b feature/secao-depoimentos
git checkout -b fix/menu-mobile-quebrado
git checkout -b content/atualiza-precos
```

### 3. Fazer as edições no projeto

Trabalhe normalmente nos arquivos. Ao finalizar cada bloco lógico de mudança, commite.

### 4. Commitar com mensagem padronizada

```bash
git add .
git commit -m "tipo: descrição clara do que foi feito"
```

Exemplos de mensagens:
```bash
git commit -m "feat: adiciona seção de depoimentos na home"
git commit -m "fix: corrige menu mobile que não fechava"
git commit -m "style: ajusta paleta de cores do header"
git commit -m "content: atualiza preços e fotos dos produtos"
git commit -m "config: adiciona variável de ambiente para API"
```

### 5. Subir o branch para o GitHub

```bash
git push origin nome-do-branch
```

> A Vercel detecta automaticamente e gera uma URL de preview.

### 6. Abrir o Pull Request

```bash
gh pr create --title "Título claro da alteração" --body "O que foi alterado e por quê"
```

> Após o push, a Vercel posta o link de preview automaticamente no comentário do PR.

### 7. Revisar pelo link de preview da Vercel

Acesse a URL de preview gerada pela Vercel para validar visualmente antes do merge.
Padrão da URL:
```
https://[nome-do-projeto]-git-[nome-do-branch]-[seu-usuario].vercel.app
```

### 8. Fazer o merge na main (somente após revisão)

```bash
gh pr merge --squash
```

> A Vercel dispara o deploy de produção automaticamente após o merge.

### 9. Limpar o branch local após o merge

```bash
git checkout main
git pull origin main
git branch -d nome-do-branch
```

---

## ✅ Checklist Rápido por Tarefa

```
[ ] git checkout main && git pull origin main
[ ] git checkout -b tipo/nome-da-tarefa
[ ] Fazer as edições
[ ] git add . && git commit -m "tipo: descrição"
[ ] git push origin tipo/nome-da-tarefa
[ ] gh pr create
[ ] Revisar pelo link de preview da Vercel
[ ] gh pr merge --squash
[ ] git checkout main && git pull origin main
[ ] git branch -d tipo/nome-da-tarefa
```

---

## 🔍 Como acessar os links de preview da Vercel

**Opção 1 — Pelo PR no GitHub:**
A Vercel posta automaticamente o link de preview como comentário no Pull Request.

**Opção 2 — Pelo painel da Vercel:**
`vercel.com/dashboard` → projeto → aba **Deployments**

**Opção 3 — URL direta (padrão previsível):**
```
https://[nome-do-projeto]-git-[nome-do-branch]-[seu-usuario].vercel.app
```

---

## 📁 Estrutura do Projeto

> Preenchido automaticamente na inicialização com base no framework escolhido.

```
Mostruario Bestiario/
│
├── index.html                        ← Página única, ponto de entrada
├── style.css                         ← Todos os estilos e animações
├── main.js                           ← Toda a interatividade e renderização
│
├── data/
│   └── monsters.json                 ← Fonte de dados dos monstros
│
├── FAVICON - Vante Bestiarium.png    ← Favicon do site
└── CLAUDE.md
```

---

## 🔐 Variáveis de Ambiente

> Nunca commitar arquivos `.env` no repositório.
> Variáveis de ambiente são configuradas diretamente no painel da Vercel.

Variáveis utilizadas neste projeto:
```
Nenhuma variável de ambiente necessária — projeto estático puro (HTML/CSS/JS).
```

---

## 📝 Observações Específicas do Projeto

> Atualizado automaticamente conforme decisões forem tomadas durante o desenvolvimento.

```
- Nome do site: Vante Bestiarium
- Tipo: Enciclopédia interativa de monstros para RPG de mesa (página única)
- Estilo visual: Grimório antigo — fundo quase preto, roxo profundo, vermelho sangue, pergaminho
- Fontes: Cinzel Decorative (títulos), IM Fell English (lore), Space Mono (stats)
- Animações: névoa no canvas, flip 3D nos cards, brilho de raridade por keyframes, Intersection Observer
- Dados: 12–16 monstros em data/monsters.json (sem backend, sem API)
- Deploy: Vercel — site estático, sem build step necessário
```

---

## 🚫 O que nunca fazer

- Nunca dar `git push origin main` diretamente
- Nunca fazer `git merge` local na main sem PR
- Nunca commitar arquivos `.env`, chaves de API ou senhas
- Nunca deletar um branch antes do merge ser confirmado
- Nunca fazer merge sem revisar pelo link de preview da Vercel
