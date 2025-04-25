"use client" ;

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import {ClipLoader} from "react-spinners" ;
import { useCallback, useEffect } from "react";
import { newVerification } from "@/actions/new-verification";
import { useState } from "react";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {
    const [error , setError]  = useState<string | undefined> () ;
    const [success , setSuccess]  = useState<string | undefined> () ;
    
    const searchParams = useSearchParams() ;

    const token = searchParams.get("token") ;

    const onSubmit = useCallback(() => {
        if(!token) {
            setError("Missing Token") 
            return; 
        }
        newVerification(token)
            .then((data) => {
                setSuccess(data.success)
                setError(data.error)
            })
            .catch(() => {
                setError("Something went wrong")
            })
    },[token]);

    useEffect(() => {
        onSubmit() ;
    },[onSubmit]) ;

    return(
        <CardWrapper
            headerLabel="Confirming your email"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error &&(<ClipLoader
                color="#6de88c"
                size={38} 
                />)}
                <FormSuccess message={success}/>
                <FormError message={error} />
            </div>
        </CardWrapper>
    )
}