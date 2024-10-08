import { ObjectId } from "mongodb";

export const typeDef = `
type Query {
users: [User!]!
user(id: ID!): User
}

type Mutation
{
    createUser(user: NewUserInput): User
    deleteUser(id: ID!): Boolean
    updateUser(id:ID!, update: UpdateUserInput): User
}

input NewUserInput {
    name: String!
    email: String!
}

input UpdateUserInput{
    name: String!
}

type User {
    id: ID
    name: String
    email: String

    comments: [Comment]
    }
`;

export const userResolvers = {
    Query: {
        users: (obj, args, { mongo }) => {
            return mongo.users.find().toArray();
        }, 
        user: (obj, { id }, { mongo }) => {
            return mongo.users.findOne({_id : new ObjectId(id)});
          },
    },
    Mutation:{
        createUser: async (_, {user}, {mongo}) => {
            const response = await mongo.users.insertOne(user);
            return {
                id : response.insertedId,
                ...user
            }
        },
        deleteUser : async(_, {id}, {mongo}) => {
            await mongo.users.deleteOne({_id: new ObjectId(id)});
            return true;
        },
        updateUser : async(_, {id, update}, {mongo}) => {
            const response = await mongo.users.updateOne({_id: new ObjectId(id)},{$set: { name: update.name} });
            return mongo.users.findOne({_id: new ObjectId(id)});
        }
    },

    User: {
        id: (obj) => {
            return obj._id;
        },
        name: (obj) => {
          return obj.name.toUpperCase();
        },
        comments : ({email}, args, { mongo }) => {
            return mongo.comments.find({email}).limit(20).toArray();
        }
      },
}
