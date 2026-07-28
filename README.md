# my·training

Aplicação pessoal para criar, gerenciar e mapear treinos de academia.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind v4 — tokens em `@theme` no `src/app/globals.css`
- Prisma 7 + SQLite via `@prisma/adapter-better-sqlite3`

## Começando

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

O schema em `prisma/schema.prisma` ainda não tem modelos e não existe histórico de migrations.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run lint` | eslint |
| `npm run db:migrate` | cria e aplica migration de desenvolvimento |
| `npm run db:studio` | Prisma Studio |

## Documentação

- [`AGENTS.md`](AGENTS.md) — regras de arquitetura, UI e estilo de código
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — design system e a tradução dele para este projeto
