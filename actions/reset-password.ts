"use server" ;

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import { z } from "zod";


export const reset = async (values : z.infer<typeof ResetSchema>) => {
    
    const validatedFileds = ResetSchema.safeParse(values) ;

    if(!validatedFileds.success) {
        return {error : "Invalid email!"}
    }

    const {email}  = validatedFileds.data;

    const existingUser = await getUserByEmail(email) ; 

    if(!existingUser) {
        return {error : "Email not found!"}
    }

    // TODO : Generate token & send email

    const resetToken = await generatePasswordResetToken(email) ; 
    sendPasswordResetEmail(
        resetToken.email , 
        resetToken.token
    ) ;

    return {success : "Reset email sent!"}

}