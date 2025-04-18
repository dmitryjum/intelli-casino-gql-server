import { withFilter } from 'graphql-subscriptions'
import { IResolvers } from '@graphql-tools/utils';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-scalars';
import { queryResolvers } from './queryResolvers';
import { mutationResolvers } from './mutationResolvers';
import { pubsub } from '@/src/lib/redisPubSub';

const GAME_UPDATED = 'GAME_UPDATED';

const resolvers: IResolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,

  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: {
    gameUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator(GAME_UPDATED),
        (payload, variables) => {
          if (variables.gameId) {
            return payload.gameUpdated.id === variables.gameId;
          }
          return true; // If no gameId provided, send all updates
        }
      ),
    },
  },
}

export default resolvers;