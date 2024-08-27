import { createSchema } from "graphql-yoga";
import { typeDef as User, userResolvers as userResolvers} from "./models/user.js";
import { typeDef as Comment, resolvers as commentResolvers } from "./models/comments.js";
import _ from "lodash";

const queries = `
      type Query {
        hello: String
        user: User
      }`;

const resolvers = {
    Query: {
      hello: () => "Hello from Yoga!",
      
    },
  };

export const schema = createSchema({
  typeDefs: [queries, User, Comment],
  resolvers: _.merge(resolvers, userResolvers, commentResolvers),
});
