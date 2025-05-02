"use client" ;

import { CardWrapper } from "@/components/auth/card-wrapper";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import * as z from "zod" ;

import { LoginSchema } from "@/schemas";

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



export const LoginForm = () => {
    const searchParams = useSearchParams() ;
    const urlError = searchParams.get("error") == "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    :"" ;
    const [showTwoFactor , setShowTwoFactor] = useState(false) ; 
    const [isPending , startTransition] = useTransition() ;
    const [error ,setError ] = useState<string | undefined>("") ;
    const [success, setSuccess] = useState<string | undefined>("") ; 
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues : {
            email : "" ,
            password : "",
            code : "" ,
        },
        });

        const onSubmit = (values : z.infer<typeof LoginSchema>) => {
            setError("") ;
            setSuccess("") ;
            startTransition (() => {
                login(values) 
                    .then((data) => {
                        if (data) {
                            if (data.error) {
                                form.reset() ;
                                setError(data.error);
                            }
                            if (data.success) {
                                form.reset();
                                setSuccess(data.success) ;
                                redirect(DEFAULT_LOGIN_REDIRECT) ;
                            }
                            if(data.twoFactor){
                                setShowTwoFactor(true) ; 
                            }
                        }
                        
                    })
                    .catch (() => ("Something went wrong!"));
            });
        }
    

    return (

        <CardWrapper
        headerLabel="Welcome back"
        backButtonHref="/auth/register"
        backButtonLabel="Don't have an account?"
        showSocial
        >
            <Form 
                {...form}
            >
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
                    {!showTwoFactor && (<>
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
                                        placeholder="********" 
                                        type="password"
                                        />
                                        
                                        
                                    </FormControl>
                                    
                                    <FormMessage />
                                </FormItem>
                                
                            )}
                            />
                    
                                <Button
                                    size= "sm"
                                    variant= "link"
                                    asChild
                                    className="px-0 font-normal"
                                >
                                    <Link href="/auth/reset">
                                        Forgot password?
                                    </Link>
                                </Button>
                        </>)}
                    </div>
                        {showTwoFactor && (<FormField
                            control={form.control}
                            name = 'code'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Two Factor Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled = {isPending}
                                        placeholder="123456" 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}
                        />)}
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                    disabled = {isPending}
                    type="submit"
                    className="w-full "
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}