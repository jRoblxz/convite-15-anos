# Convite de 15 anos

React + TypeScript (Vite) + Firebase Firestore.

## Rodando

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha com os dados do Firebase.
3. `npm run dev`

## Firebase (uma vez só)

1. Crie um projeto em https://console.firebase.google.com
2. Adicione um app Web (ícone `</>`) e copie as chaves para o `.env.local`.
3. Em **Firestore Database**, crie o banco (modo produção).
4. Na aba **Regras**, cole o conteúdo de `firestore.rules` e publique.
5. As confirmações aparecem na coleção `rsvps`, no próprio console.

## Onde editar

- Dados do evento (nome, data, local): `src/config/event.ts`
- Seções da página: `src/components/`
- Acesso ao Firebase: `src/lib/firebase.ts` e `src/services/rsvp.ts`
