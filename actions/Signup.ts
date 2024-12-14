"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import bcrypt from "bcryptjs";

interface userDataTypes {
    username: string,
    name: string,
    password: string
}

export async function Signup(userData: userDataTypes) {
    revalidatePath("/sign-up");
    const { username, name, password } = userData;
    try {
        const findUserName = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (findUserName) {
            return { message: "Username already exist", status: false }
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const saveUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name
            }
        })

        return { msg: "Account Created Successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}