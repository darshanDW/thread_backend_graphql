
import { prismaClient } from "../../lib/db";

const queries={


};
const mutations={

    createUser: async (_:any, { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {

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



};

export const resolvers={queries,mutations};