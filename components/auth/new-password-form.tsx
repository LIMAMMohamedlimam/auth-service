"use client" ;

import { CardWrapper } from "@/components/auth/card-wrapper";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod" ;

import { NewPasswordSchema } from "@/schemas";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { use, useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";
import { newPassword } from "@/actions/new-password";



export const NewPasswordForm = () => {
    const searchParams = useSearchParams() ;
    const token = searchParams.get("token") ; 
    const [isPending , startTransition] = useTransition() ;
    const [error ,setError ] = useState<string | undefined>("") ;
    const [success, setSuccess] = useState<string | undefined>("") ; 
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues : {
            password : "" ,
        },
        });

        const onSubmit = (values : z.infer<typeof NewPasswordSchema>) => {
            setError("") ;
            setSuccess("") ;
            console.log(values)
            

            startTransition (() => {
                newPassword(values , token) 
                    .then((data) => {
                        if (data) {
                            console.log(data)
                            if (data.error) {
                                setError(data.error);
                                console.log("error")
                            }
                            if (data.success) {
                                setSuccess(data.success) ;
                                //redirect(DEFAULT_LOGIN_REDIRECT) ;
                            }
                        }
                        
                    })
            });
        }
    

    return (

        <CardWrapper
        headerLabel="Enter a new password"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        
        >
            <Form 
                {...form}
            >
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name = 'password'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    disabled = {isPending}
                                    placeholder="******" 
                                    type="password"
                                    />
                                    
                                    
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        
                    </div>
                    
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                    disabled = {isPending}
                    type="submit"
                    className="w-full "
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}