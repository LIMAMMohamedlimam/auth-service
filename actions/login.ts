"use server";


import * as z from "zod" ;
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { NextURL } from "next/dist/server/web/next-url";

export const login = async(values : z.infer<typeof LoginSchema>) => {
    const validatedFileds = LoginSchema.safeParse(values);
    console.log(values)

    if(!validatedFileds.success){
        return {error : "Invalid Fileds!"}
    }

    const { email , password } = validatedFileds.data ;
    
    try {
        console.log("signing in") ;
        const res = await signIn("credentials", {
            email ,
            password,
            redirect: false 
        }
        )
        console.log(res)
        if(res) {
            return { success: "Login successful!" };
        }
        
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin" :
                    return {error : "Invalid Credentials!"} 
                default : 
                    return {error : "Something went wrong"}
            }
        }
    }

    

    
};