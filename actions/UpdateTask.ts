"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";
import { taskDataTypes } from "./Addtask";

export async function UpdateTask(taskData: taskDataTypes) {
    revalidatePath("/");
    try {
        const getUserDetails = await GetUserDetails();
        if (!getUserDetails) {
            return { msg: "Failed to add task", status: false };
        }

        console.log("Task Data is for updated  : ", taskData);
        const updateTask = await prisma.task.update({
            where: {
                id: taskData.id
            },
            data: {
                title: taskData.title,
                priority: taskData.priority,
                status: taskData.status,
                startTime: taskData.startTime,
                endTime: taskData.endTime,
                userId: getUserDetails.decodeCookieValue?.id
            }
        })

        console.log("UPdated task is: ", updateTask);
        return { msg: "Task updated successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}