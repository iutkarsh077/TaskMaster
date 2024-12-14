"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function DeleteTask(selectedDeleteTask: any) {
    revalidatePath("/");
    try {
        const deleteTasks = await prisma.task.deleteMany({
            where: {
                id: {
                    in: selectedDeleteTask
                }
            }
        })
        return { msg: "Task deleted successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}