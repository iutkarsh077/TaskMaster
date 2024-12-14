"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GetUserDetails(){
    revalidatePath("/");

    try {
        const cookieStore = await cookies();

        const getCookie = cookieStore.get("taskList")?.value as string;
        const decodeCookieValue = jwt.verify(getCookie, process.env.JWT_SECRET!) as JwtPayload;

        return { msg: "Get the user details", decodeCookieValue, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}