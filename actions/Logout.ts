"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function Logout() {
    revalidatePath("/")
    try {
        const cookie = await cookies();
    const getCookie = cookie.delete("taskList");
    return {msg: "Logout successsfully", status: true}
    } catch (error) {
        return {msg: "Internal server error", status: false}
    }
}