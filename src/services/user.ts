import { inflateRaw } from "node:zlib";
import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto"
import Jwt from "jsonwebtoken";
import { emit } from "node:process";
import { env } from "node:process";
import dotenv from 'dotenv'
export interface createUserpayload {


    firstName: string
    lastName: string
    email: string
    password: string



}



export interface getUserToken {
    email: string
    password: string

}

export class UserService {

    public static generateHash(salt: any, password: string) {
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        console.log(hashedPassword)
        return hashedPassword;



    }

    public static async createUser(payload: createUserpayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = this.generateHash(salt, password);
        return prismaClient.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                salt: salt
            }
        })
    }
    private static async getUserByEmail(email: string) {

        return prismaClient.user.findUnique({ where: { email } })
    }


    public static async getUserToken(payload: getUserToken) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new Error("User not found")
        }
        const usersalt = user.salt;
        console.log(user.salt)

        const userhashpassword = UserService.generateHash(usersalt, password);
        // console.log(userhashpassword)
        if (userhashpassword != user.password) {
            throw new Error("Invalid password")

        }
        //generate token
        const JWTsecret = env.JWT_SECRET
        console.log("secret", JWTsecret)
        const token = Jwt.sign({ id: user.id, email: user.email }, "daf")
        return token;

    }
}

