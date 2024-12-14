"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export async function GetUserTask() {
    revalidatePath("/");
    try {
        const userDetails = await GetUserDetails();
        if (!userDetails || !userDetails.decodeCookieValue) {
            return { msg: "failed to get Task", status: false };
        }

        const getTasks = await prisma.task.findMany({
            where: {
                userId: userDetails.decodeCookieValue.id
            }
        })

        return { msg: "Successfully get the task", task: getTasks, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}