import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
import { config } from 'dotenv';
import express from 'express';

config({ path: './config.env' });
import createContext from './context.js'; 
import { AuthenticationError } from 'apollo-server-errors';
const app = express();


const JWT_SECRET = process.env.JWT_SECRET;

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

// console.log(createContext);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => createContext({ req }),
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests


  async function startServer() {
    await server.start();
    server.applyMiddleware({ app }); // Assuming you have an Express app named 'app'
    console.log('Apollo Server started and middleware applied');
  }
  
  startServer().catch((error) => {
    console.error('Error starting server:', error);
  });

  // Start the Express server
app.listen({ port: 4000 }, () =>
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);