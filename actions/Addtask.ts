"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export interface taskDataTypes {
    id?: string,
    title: string,
    priority: string,
    status: string,
    startTime: Date,
    endTime: Date,

}

export async function AddTask(taskData: taskDataTypes){
    revalidatePath("/");
    try {
        const getUserDetails = await GetUserDetails();
        if(!getUserDetails){
            return { msg: "Failed to add task", status: false };
        }


        const addTask = await prisma.task.create({
            data: {
                title: taskData.title,
                priority: taskData.priority,
                status: taskData.status,
                startTime: taskData.startTime,
                endTime: taskData.endTime,
                userId: getUserDetails.decodeCookieValue?.id
            }
        })
        return { msg: "Task added successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}