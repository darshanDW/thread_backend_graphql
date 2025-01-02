import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { User } from './user';
async function createApolloserver(){
    const gqlServer = new ApolloServer({
        typeDefs: `
        ${User.typeDefs}
        type Query {
            
            ${User.queries}  }

            type Mutation {

                
${User.mutation}  }      
        
        `,




        resolvers: {
            
            Query: {
...User.resolvers.queries
            },
            Mutation: {
               ...User.resolvers.mutations }
        }




    }



    );

    await gqlServer.start();
    return gqlServer;
}

export default createApolloserver;
// import { ApolloServer } from '@apollo/server';
// import { prismaClient } from '../lib/db';
// import { User } from './user';
// async function createApolloserver(){
//     const gqlServer = new ApolloServer({
//         typeDefs: `
//         type Query {
        
//             hello: String,
//             say(name:String):String}

//             type Mutation {
//          createUser(firstName:String!,lastName:String! ,email:String!,password:String!):Boolean   }
        
        
//         `,
//         resolvers: {
//             Query: {
//                 hello: () => { return "Hello World" },
//                 say: (_, { name }) => {
//                     return `Hello ${name}`
//                 },

//             },
//             Mutation: {
//                 createUser: async (_, { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {

//                   await prismaClient.user.create({

// data:{
//     firstName:firstName,
//     lastName:lastName,
//     email:email,
//     password:password,
//     salt:"random_salt"
// }


//                   });
//                   return true;



//                 }
//             }
//         }




//     }



//     );
//     await gqlServer.start();
//     return gqlServer;
// }

// export default createApolloserver;