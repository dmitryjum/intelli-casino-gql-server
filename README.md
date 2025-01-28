# Intelli Casino GraphQL Server

This is a standalone **Express + Apollo Server** application that provides a GraphQL endpoint with subscriptions (via WebSockets). It also integrates with **Prisma** for database access and uses **NextAuth** logic to authenticate requests with session cookies.

---

## Features

- **GraphQL** endpoint at `/api/graphql`
- **Subscriptions** via WebSockets (using `graphql-ws`)
- **Redis PubSub** for handling real-time subscriptions
- **Prisma** ORM for PostgreSQL (or any other supported DB)
- **NextAuth**-compatible session validation
- Custom resolvers, mutations, and subscriptions for real-time quiz/gaming logic

---

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL](https://graphql.org/)
- [graphql-ws](https://github.com/enisdenjo/graphql-ws) for subscriptions
- [Redis](https://redis.io/) for PubSub
- [Prisma](https://www.prisma.io/) for database access
- [NextAuth](https://next-auth.js.org/) for session handling
- [WebSockets](https://developer.mozilla.org/docs/Web/API/WebSockets_API)

---

## Project Structure

```
my-graphql-server/
 ┣ prisma/
 ┃ ┗ schema.prisma        # Prisma schema
 ┣ src/
 ┃ ┣ resolvers/
 ┃ ┃ ┗ index.ts           # Your GraphQL resolvers (Queries, Mutations, Subscriptions)
 ┃ ┣ schema.ts            # GraphQL type definitions (SDL)
 ┃ ┣ lib/
 ┃ ┃ ┗ redisPubSub.ts     # Redis PubSub configuration
 ┃ ┣ nextAuthOptions.ts   # (Optional) NextAuth config if you want to replicate it here
 ┃ ┗ index.ts             # Entry point (Express + ApolloServer setup)
 ┣ .env.example           # Example environment variables
 ┣ package.json
 ┣ tsconfig.json
 ┗ README.md              # This file
```

---

## Getting Started (Local Development)

1. **Clone** the repository:

   ```bash
   git clone https://github.com/dmitryjum/intelli-casino-gql-server.git
   cd intelli-casino-gql-server
   ```

2. **Install** dependencies:

   ```bash
   npm install
   ```

3. **Create** a `.env` file in the project root (or wherever you like) based on `.env.example`. For example:

   ```bash
   cp .env.example .env
   ```

   Then update the variables inside `.env`:

   ```bash
   # .env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   NEXTAUTH_SECRET="some-random-secret"
   CLIENT_ORIGIN="http://localhost:3000"
   PORT=4000
   ```

4. **Set up** Prisma (optional step if you need migrations):

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

   This will apply migrations and generate Prisma client files.

5. **Run** the development server:

   ```bash
   npm run dev
   ```

   By default, the server starts on **`localhost:4000`** (or whatever you set in `PORT`).

6. **Test** it out:
   - Visit [`http://localhost:4000/api/graphql`](http://localhost:4000/api/graphql) in your browser or use a tool like [Apollo Sandbox](https://studio.apollographql.com/sandbox) to send GraphQL queries.
   - Subscriptions should be available via `ws://localhost:4000/api/graphql`.

---


## Environment Variables

| Variable          | Description                                            | Example                                  |
| ----------------- | ------------------------------------------------------ | ---------------------------------------- |
| `DATABASE_URL`    | The URL for your Postgres (or other) database          | `postgresql://user:pass@host:5432/db`    |
| `NEXTAUTH_SECRET` | Secret key for NextAuth session encryption/validation  | `my-secret-key`                          |
| `CLIENT_ORIGIN`   | The origin (URL) of your front-end (CORS allowed)      | `http://localhost:3000`                  |
| `PORT`            | Port on which the server will listen                   | `4000`                                   |
| `REDIS_HOST`      | Host for your Redis server                             | `127.0.0.1`                              |
| `REDIS_PORT`      | Port for your Redis server                             | `6379`                                   |
| `REDIS_PASSWORD`  | Password for your Redis server (if any)                | `your-redis-password`                    |

---

## Usage Notes

- **Redis PubSub**  
  The server uses Redis for handling real-time subscriptions. Ensure your Redis server is running and accessible with the correct environment variables set for `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD`.

- **Authentication**  
  The server uses [`getServerSession`](https://next-auth.js.org/configuration/nextjs) from **NextAuth** to validate the user’s session cookie. Make sure you have:
  - The same `NEXTAUTH_SECRET` across both this server and your Next.js app.
  - The same or compatible session storage (e.g., the same `DATABASE_URL` if you store sessions in the DB).

- **Subscriptions**  
  Subscriptions are handled via `graphql-ws` and Redis PubSub.  
  - For WebSocket connections, the path is `ws://<HOST>:<PORT>/api/graphql`.  
  - Make sure your front-end Apollo Client is configured with a `WebSocketLink` to that URL.

- **CORS**  
  By default, the code sets CORS to allow `CLIENT_ORIGIN`. If your front end is served from `https://myapp.vercel.app`, set `CLIENT_ORIGIN=https://myapp.vercel.app` in production.

---

<!-- ## Deployment

You can deploy this app on any Node-friendly host that supports WebSockets, such as:

- **Railway** ([railway.app](https://railway.app/))
- **Render** ([render.com](https://render.com/))
- **Fly.io** ([fly.io](https://fly.io/))

### Example: Deploying to Railway

1. **Create** a new project on [Railway](https://railway.app/).
2. **Connect** your GitHub repo.
3. Set the build and start commands (if needed), for example:
   - **Build command**: `npm install && npm run prisma:generate`
   - **Start command**: `npm run start`
4. Add environment variables in the Railway dashboard for `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.
5. Deploy and wait for your service to come up.
6. Access your endpoint at `https://your-railway-app.up.railway.app/api/graphql` and subscriptions at `wss://your-railway-app.up.railway.app/api/graphql`. -->

---

## Contributing

1. Fork this repo.
2. Create a feature branch.
3. Commit and push your changes.
4. Submit a Pull Request for review.

---

<!-- ## License

[MIT](./LICENSE) (or your preferred license) -->

---

### Author

- **Dmitry Jum** – [@dmitryjum](https://github.com/dmitryjum)

---

_Thanks for checking out **My GraphQL Server**!_