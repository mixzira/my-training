<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# my·training

Aplicação pessoal para criar, gerenciar e mapear treinos de academia.

## Stack

| Peça | Versão | Observação |
|---|---|---|
| Next.js | 16 (App Router) | Turbopack |
| React | 19 | Server Components por padrão |
| Tailwind | v4 | Tokens em `@theme` dentro de `src/app/globals.css`. Não existe `tailwind.config.js` |
| Prisma | 7 | SQLite via driver adapter `@prisma/adapter-better-sqlite3`. Config em `prisma.config.ts` |
| TypeScript | 5 | `strict` |

## Contexto que muda as decisões

- **Uso pessoal, um único usuário.** Não há login, não há autorização, não há multi-tenancy. Não introduza nenhum dos três sem ser pedido.
- **Banco local em arquivo** (`prisma/dev.db`). SQLite serializa escritas.
- **O aparelho de uso é o celular, na academia.** Mobile-first não é preferência, é o caso de uso.

## Escopo

Implemente exatamente o que foi pedido. Não adicione rotas, telas, campos, seeds ou funcionalidades que não foram solicitados. Quando faltar informação, pergunte antes de inventar.

## Regras de arquitetura

1. **Server Component é o padrão.** `"use client"` só quando houver estado, evento de input ou API de browser — e sempre na folha da árvore, nunca em página ou layout.
2. **Ler dados**: direto do `prisma` dentro do Server Component. Sem camada de API, sem `fetch` para a própria aplicação.
3. **Escrever dados**: Server Actions em arquivos `actions.ts` com `"use server"` no topo, junto da rota que os usa.
4. Depois de uma mutação: `revalidatePath(...)` ou `refresh()` de `next/cache`. Nunca refetch manual no cliente.
5. Formulários usam `<form action={serverAction}>`. Estado de pending vem de `useActionState` / `useFormStatus`, não de `useState`.
6. Validação de entrada acontece dentro da Server Action, antes de tocar o banco.
7. `src/lib/prisma.ts` é o único ponto que instancia o `PrismaClient`. É `server-only`.
8. Toda mudança de schema passa por `npx prisma migrate dev --name <nome>`. Nunca edite o SQL de uma migration já aplicada.

## Regras de UI

O design system está em [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) e é a fonte da verdade. Os tokens vivem em `@theme` no `globals.css`.

1. **Nunca hex inline.** `bg-canvas-parchment`, `text-ink`, `bg-primary` — jamais `bg-[#0066cc]`.
2. **Um único azul interativo**: `primary` em superfície clara, `primary-on-dark` em tile escuro. Não existe segunda cor de acento.
3. **Zero sombra e zero gradiente.** Hierarquia vem da troca de superfície (claro ↔ escuro) e da tipografia.
4. **Mobile-first**: escreva o estilo do telefone sem prefixo; só então `md:`, `lg:`, `xl:`. Breakpoints: `sm` 480, `md` 640, `lg` 834, `xl` 1068, `2xl` 1440.
5. **Alvo de toque de 44px** em qualquer elemento clicável (`min-h-touch`).
6. **`active:scale-95`** em todo botão.
7. Corpo de texto a 17px (`text-body`). Peso 500 não existe na escala — use 400 ou 600.
8. Faixas full-bleed (`Tile`) não têm raio. Cards utilitários usam `rounded-lg`. Ações usam `rounded-pill`.
9. Textos da interface em português do Brasil.

## Estilo de código

- **Sem comentários no código.** Se um trecho precisa de explicação, renomeie ou extraia até não precisar.
- Nomes de arquivo em `kebab-case`. Componentes em `PascalCase`.
- Rotas em português; código, tipos e campos do schema em inglês.
- Composição de classes sempre por `cn()` de `src/lib/cn.ts`.

## Estrutura

```
prisma/schema.prisma          modelos e migrations
src/app/                      rotas (App Router)
src/components/app-shell/     chrome: global-nav, sub-nav, footer
src/components/ui/            primitivas do design system
src/lib/prisma.ts             cliente Prisma (server-only)
src/lib/cn.ts                 merge de classes Tailwind
src/generated/prisma/         client gerado (não versionado)
docs/DESIGN_SYSTEM.md         design system
```

## Comandos

```
npm run dev        servidor de desenvolvimento
npm run build      build de produção
npm run lint       eslint
npm run db:migrate migration de desenvolvimento
npm run db:studio  Prisma Studio
```

## Antes de entregar

1. `npm run lint` sem erros.
2. `npx tsc --noEmit` sem erros.
3. A tela foi verificada em largura de 390px antes de qualquer outra.
