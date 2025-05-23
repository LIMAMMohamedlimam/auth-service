"use server";
import * as z from "zod" ;
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import bcrypt from "bcrypt" ;
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async(values : z.infer<typeof RegisterSchema>) => {
    const validatedFileds = RegisterSchema.safeParse(values);

    if(!validatedFileds.success) {
        return {error : "Invalied fields!"}
    }

    const {
        email,
        password,
        name
    } = validatedFileds.data
    const existingUser = await getUserByEmail(email) ;

    if(existingUser){
        return {error : "Email already in use!"}
    }

    const hashedPassword = await bcrypt.hash(password , 10) ; 

    await db.user.create({
        data:{
            name,
            email,
            password : hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email) ;

    //TODO : Send verification email

    await sendVerificationEmail(verificationToken.email ,verificationToken.token) ;

    return {success : "Confirmation Email Sent"}

    
};