const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { default: axios } = require("axios");
const cors = require("cors");

async function startServer() {
  const app = express();
  //to get query to post mutation
  const server = new ApolloServer({
    typeDefs: `
    type User{
        id:ID!
        name:String!
        phone:String!
        website:String!
    }
        type Todo{
            id:ID!
            title:String!
            completed:Boolean
            user:User
        }
        type Query {
        getTodos:[Todo]
        getUsers:[User]
        getUser(id:ID!):User
        }
        `,
    resolvers: {
      Todo:{
        user: async (parent,args) => {
          // console.log(parent)
          try {
            const response = await axios.get(
              `https://jsonplaceholder.typicode.com/users/${parent.userId}`
            );
            return response.data;
          } catch (error) {
            throw new Error(error);
          }
        }
      },
      Query: {
        // getTodos: () => [{ id: 1, title: "abcd" }],

        getTodos: async () => {
          try {
            const response = await axios.get(
              "https://jsonplaceholder.typicode.com/todos"
            );
            return response.data;
          } catch (error) {
            throw new Error(error);
          }
        },
        getUsers: async () => {
          try {
            const response = await axios.get(
              "https://jsonplaceholder.typicode.com/users"
            );
            return response.data;
          } catch (error) {
            throw new Error(error);
          }
        },

        getUser: async (parent,args) => {
          console.log(parent,args)
          try {
            const response = await axios.get(
              `https://jsonplaceholder.typicode.com/users/${args.id}`
            );
            return response.data;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
    },
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(5000, () => console.log("server is running"));
}
startServer();
