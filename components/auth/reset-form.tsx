"use client" ;

import { CardWrapper } from "@/components/auth/card-wrapper";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod" ;

import { ResetSchema } from "@/schemas";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { use, useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";
import { reset } from "@/actions/reset-password";



export const ResetForm = () => {
    
    const [isPending , startTransition] = useTransition() ;
    const [error ,setError ] = useState<string | undefined>("") ;
    const [success, setSuccess] = useState<string | undefined>("") ; 
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues : {
            email : "" ,
        },
        });

        const onSubmit = (values : z.infer<typeof ResetSchema>) => {
            setError("") ;
            setSuccess("") ;
            console.log(values)
            

            startTransition (() => {
                reset(values) 
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
        headerLabel="Forgot your password ?"
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
                        name = 'email'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    disabled = {isPending}
                                    placeholder="example@test.com" 
                                    type="email"
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
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}