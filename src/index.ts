import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import cors from 'cors';
import typeDefs from '@/src/graphql/schema';
import resolvers from '@/src/graphql/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authOptions } from '@/src/lib/nextauth';
import { getServerSession } from 'next-auth'
import cookieParser from 'cookie-parser';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
import { pubsub } from '@/src/lib/redisPubSub';
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

(async () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, matchesGlob, args) => {
        return { pubsub };
      }
    },
     wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(
    '/api/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    }),
    cookieParser(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user) {
          throw new GraphQLError('Unauthorized', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        return { req, res, session, pubsub };
      }
    }),
  );

  const PORT = 4000;

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is now running on http://localhost:${PORT}/api/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/api/graphql`);
    console.log(`🚀 Redis PubSub is running on ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  });
})();