"use server";


import * as z from "zod" ;
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async(values : z.infer<typeof LoginSchema>) => {
    const validatedFileds = LoginSchema.safeParse(values);

    if(!validatedFileds.success){
        return {error : "Invalid Fileds!"}
    }

    const { email , password , code } = validatedFileds.data ;
    ({
        email,
        password,
    })

    const exitingUser = await getUserByEmail(email) ;

    if(!exitingUser || !exitingUser.email || !exitingUser.password) {
        return {error : "Invalid Credentials!"}
    }

    if(!exitingUser.emailVerified) {

        
        const verificationToken = await generateVerificationToken(exitingUser.email) ;

        await sendVerificationEmail(verificationToken.email , verificationToken.token)

        return { success : "Confirmaiton email sent!"}
    }

    if(exitingUser.isTwoFactorEnabled && exitingUser.email){

        if(code){
        const twoFactorToken = await getTwoFactorTokenByEmail(exitingUser.email) ;
        if(!twoFactorToken) return {error : "Invalid code"} ;
        if(twoFactorToken.token !== code) return {error : `${twoFactorToken.token} and ${code}` } ;

        
        const hasExpired = new Date(twoFactorToken.expires) < new Date() ; 
        if(hasExpired) return {error : "Code expired!"} ; 


        await db.twoFactorToken.delete({
            where : {id : twoFactorToken.id},
        });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(exitingUser.id) ;

        if(existingConfirmation) {

        await db.twoFactorConfirmation.delete({
            where : {id : existingConfirmation.id}
        });
        }
        
        await db.twoFactorConfirmation.create({
            data : {
                userId : exitingUser.id,
            }
        })

    }else{
        const twoFactorToken = await generateTwoFactorToken(email) ;
        await sendTwoFactorTokenEmail (twoFactorToken.email , twoFactorToken.token) ;

        return {twoFactor : true} ;
    }
    }
    
    try {
        const res = await signIn("credentials", {
            email ,
            password, 
            redirect : false
        }
        )
        if(res) {
            return { success: "Login successful!" };
        }
        
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin" :
                    return {error : "Invalid Credentials!"} 
                default : 
                    return {error : "Something went wrong!"}
            }
        }
    }

    

    
};