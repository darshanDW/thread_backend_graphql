import { error } from "console";
import {CreateUserPayload, UserService} from "../../services/user";

const queries = {
  getUserToken: async (
    _: any,
    payload: { email: string; password: string }
  ) => {
    const token = await UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });
    return token;
  },

  getCurrentLoggedInUser:async(_:any,parameter:any,context:any)=>{
    console.log(context)
    if(context&& context.user){
      const id=context.user.id
      const user=await UserService.getUserById(id);
      return user;
    }
 throw new Error('i dont know ')  }
};


const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };