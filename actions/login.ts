"use server";
import * as z from "zod" ;
import { LoginSchema } from "@/schemas";

export const login = async(values : z.infer<typeof LoginSchema>) => {
    const validatedFileds = LoginSchema.safeParse(values);
    console.log(values)

    if(!validatedFileds.success) {
        return {error : "Invalied fields!"}
    }

    return {success : "Login with success"}

    
};