"use server" ;

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";




export const settings = async (
    values :  z.infer<typeof SettingsSchema>
) => {

    const validatedFields = SettingsSchema.safeParse(values) ;
    if(!validatedFields || !validatedFields.data) return {error : "Invalid input"}

    const user = await currentUser() ;

    if(!user || !user.id) {
        return {error : "Unautherized"};
    }

    const dbUser = await getUserById(user.id);
    
    if(!dbUser) {
        return {error : "Unautherized"} ;
    }

    if(user.isOauth) {
        validatedFields.data.email = undefined;
        validatedFields.data.password = undefined;
        validatedFields.data.newPassword = undefined;
        validatedFields.data.isTwoFactorEnabled = undefined ;
    }

    if(validatedFields.data.email && validatedFields.data.email !== user.email ) {
        const existingUser = await getUserByEmail(validatedFields.data.email);
        if(existingUser && existingUser.id !== user.id){
            return {error : "Email already in use!"} ;
        }

        const verificationToken = await generateVerificationToken(
            validatedFields.data.email
            );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return {success : "Verification email sent!"}

    }

    if(validatedFields.data.newPassword?.length == 0 || validatedFields.data.password?.length ==0){
        validatedFields.data.password = undefined;
        validatedFields.data.newPassword = undefined;
    }

    if(validatedFields.data.password 
         && validatedFields.data.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(
            validatedFields.data.password,
            dbUser.password,
        );
        if(!passwordMatch){
            return {error : "Incorrect Password"} ;
        }
        const hashedPassword = await bcrypt.hash(
            validatedFields.data.newPassword,
            10
        );
        validatedFields.data.password = hashedPassword ;
        validatedFields.data.newPassword = undefined;
    }

    console.log(validatedFields.data)

    await db.user.update({
        where : {id : dbUser.id },
        data :{
            ...validatedFields.data,
        }
    });

    return {success : "Settings Updated "} ;

}