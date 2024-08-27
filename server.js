var { graphql, buildSchema } = require("graphql")
var express = require('express')
var { createHandler } = require('graphql-http/lib/use/express')
var { ruruHTML } = require("ruru/server")
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello(name: String!): String
    age: Int
    weight: Float! 
    isOver18: Boolean
    hobbies: [String]
    user: User
  }

  type User {
    id:ID
    name: String
  }
`) // ! is used to mark any field mandatory or non optional
 
// The rootValue provides a resolver function for each API endpoint
var rootValue = {
  hello:({name}) => {
    return "Hello " + name
  },
  age: () => {
    return 24;
  },
  weight: () => {
    return 84.5;
  },
  isOver18: () => {
    return true;
  },
  hobbies: () => {
    return ['Carting', 'F1', 'Simulator']
  },
  user: () => {
    return{
      id: 1,
    name: 'Sathwik'
    }
  }
}

const app = express()

app.all('/graphql', createHandler({schema, rootValue}))

app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.listen(3000)

console.log('Api running on: http://localhost:3000')