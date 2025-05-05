import { UserRole } from "@/lib/generated/prisma";
import * as z from "zod" ;


export const SettingsSchema = z.object({
    name : z.optional(z.string().min(1)),
    isTwoFactorEnabled : z.optional(z.boolean()),
    role : z.enum([UserRole.ADMIN,UserRole.USER]),
    email : z.optional(z.string().email()),
    password : z.optional(z.string().min(8,{message : "Minimum 8 characters required"})),
    newPassword : z.z.optional(z.string().min(8)),
}).refine((data) => {
    if(data.password && !data.newPassword) return false 
    if(data.newPassword && !data.password) return false

    return true ;
} , {
    message : "Both password and New password fields are required",
    path : ["password" , "newPassword"]
});

export const LoginSchema = z.object({
    email : z.string().email({
        message: "Email is required"
    }).min(1) ,
    password : z.string().min(1,{
        message : "Password is required",
    }),
    code : z.string().optional() ,
});


export const RegisterSchema = z.object({
    email : z.string().email({
        message: "Email is required"
    }).min(1) ,
    password : z.string().min(8,{
        message : "minimum 8 characters required",
    }),
    name : z.string().min(1 , 
        {message: "minimum length 1"}
        )
})


export const ResetSchema = z.object({
    email : z.string().email({
        message : "Email is required"
    }).min(1),
})

export const NewPasswordSchema = z.object({
    password : z.string().min(8,{
        message : "Minimum of 8 characteres required"
    }),
})