import * as z from "zod" ;

export const LoginSchema = z.object({
    email : z.string().email({
        message: "Email is required"
    }).min(1) ,
    password : z.string().min(1,{
        message : "Password is required",
    })
});


export const RegisterSchema = z.object({
    email : z.string().email({
        message: "Email is required"
    }).min(1) ,
    password : z.string().min(8,{
        message : "minimum 6 caracters required",
    }),
    name : z.string().min(1 , 
        {message: "minimum length 1"}
        )
})