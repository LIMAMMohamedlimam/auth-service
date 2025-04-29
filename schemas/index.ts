import * as z from "zod" ;

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
        message : "minimum 8 caracters required",
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