import { emit } from "process";
import { Resend } from "resend" ; 

const resend = new Resend(process.env.RESEND_API_KEY) ;
const domaine = process.env.NEXT_PUBLIC_APP_URL ;

export const sendTwoFactorTokenEmail = async (
    email : string ,
    token : string
) => {

    await resend.emails.send({
        from  : "limam@resend.dev",
        to : email, 
        subject : "2FA Code",
        html : `<p>your 2FA code: ${token} </p>`
    });

};

export const sendVerificationEmail = async (
    email : string ,
    token : string
) => {
    const confirmLink = `${domaine}/auth/new-verification?token=${token}` ;

    await resend.emails.send({
        from  : "limam@resend.dev",
        to : email, 
        subject : "Confim your email",
        html : `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });

};


export const sendPasswordResetEmail =async (
    email : string,
    token : string
) => {
    
    const resetLink = `${domaine}/auth/new-password?token=${token}` ;

    await resend.emails.send({
        from  : "limamreset@resend.dev",
        to : email, 
        subject : "Reset your password",
        html : `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

}