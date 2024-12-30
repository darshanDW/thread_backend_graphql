import express from 'express'

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors'
import createApolloserver from './graphql';
import { prismaClient } from './lib/db';
async function init() {
    const app = express();
    app.use(cors())
    app.use(express.json());
   
const gqlServer=await createApolloserver();

    app.get('/', async (req, res) => {
        res.json({ message: "server is up and running" })
    })
    app.use("/graphql", expressMiddleware(gqlServer));
    app.listen(3000, () => {
        console.log(`server is running on port 3000`)
    })
}

init()