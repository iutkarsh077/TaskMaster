"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function CheckUsernameUnique(username: string) {
    revalidatePath("/sign-up");
    try {
        console.log(username)
        const findUserName = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (findUserName) {
            return { msg: "Username already exist", status: false }
        }

        return { msg: "Username is available", status: true }
    } catch (error) {
        return { msg: "Internal Server error", status: false }
    }
}