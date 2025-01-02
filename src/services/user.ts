import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

export class UserService {
    public static generateHash(salt: any, password: string) {
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        console.log(hashedPassword);
        return hashedPassword;
    }

    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = this.generateHash(salt, password);
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                salt,
            },
        });
    }

    private static async getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } });
    }
public static async getUserById(id:string){
const user=await prismaClient.user.findUnique({where:{id}})
return user;


}
    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        const userSalt = user.salt;
        console.log(user.salt);

        const userHashedPassword = UserService.generateHash(userSalt, password);
        if (userHashedPassword !== user.password) {
            throw new Error("Invalid password");
        }

        const token = Jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        return token;
    }

    public static async decodeToken(token: string) {
        try {
            const decoded: any = Jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (err: any) {
            { }
        }
    }
}
