import { db } from "@/lib/db" ;
import { string } from "zod";

export const getVerficationTokenByEmail = async (
    email : string
) => {
    try {
        
        const verificationToken = await db.verificationToken.findFirst({
            where : { email }
        });
        return verificationToken ;
    } catch {
        return null ;
    }
}

export const getVerficationTokenByToken = async (
    token : string
) => {
    try {
        
        const verificationToken = await db.verificationToken.findUnique({
            where : { token }
        });
        return verificationToken ;
    } catch {
        return null ;
    }
}