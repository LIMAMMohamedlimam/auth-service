import { useSession } from "next-auth/react";



export const useCurrentRole = () => {
    const role  = useSession().data?.user?.role ; 

    return role ;
} 