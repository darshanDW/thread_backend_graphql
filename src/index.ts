import express from 'express'

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors'
import { prismaClient } from './lib/db';
async function init() {
    const app = express();
    app.use(cors())
    app.use(express.json());
    const gqlServer = new ApolloServer({
        typeDefs: `
        type Query {
        
            hello: String,
            say(name:String):String}

            type Mutation {
         createUser(firstName:String!,lastName:String! ,email:String!,password:String!):Boolean   }
        
        
        `,
        resolvers: {
            Query: {
                hello: () => { return "Hello World" },
                say: (_, { name }) => {
                    return `Hello ${name}`
                },

            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {

                  await prismaClient.user.create({

data:{
    firstName:firstName,
    lastName:lastName,
    email:email,
    password:password,
    salt:"random_salt"
}


                  });
                  return true;



                }
            }
        }




    }



    );


    await gqlServer.start();
    app.get('/', async (req, res) => {
        res.json({ message: "server is up and running" })
    })
    app.use("/graphql", expressMiddleware(gqlServer));
    app.listen(3000, () => {
        console.log(`server is running on port 3000`)
    })
}

init()