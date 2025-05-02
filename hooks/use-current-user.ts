"use client" ;

import { useSession } from "next-auth/react";

export const CurrentUser =async () => {
    const session = useSession() ; 
    return session.data?.user ;
}