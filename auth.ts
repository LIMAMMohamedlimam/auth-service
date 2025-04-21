import authConfig from "@/auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "@/data/user"
import NextAuth, {type DefaultSession} from "next-auth" 


declare module "@auth/core" {
  

  interface Session  {
    user : {
      role : string ;
    } & DefaultSession["user"]
  }

}

export const {
   auth, 
   handlers, 
   signIn, 
   signOut 
  } = NextAuth({
    callbacks : {
      async session ({token , session }){
        console.log({
          sessionToken : token ,
          session
        })

        if (token.sub && session.user) {
          session.user.id = token.sub ;
        }
        if(token.role && session.user) {
          return {
            ...session,
            user: {
              ...session.user,
              role : token.role,
            }
          }
        }

        return session ;

        ;
      },
      async jwt ({token}){
        if(!token.sub)  return token ;

        const existUser  = await getUserById(token.sub) ;

        if(!existUser) return token ;

        token.role = existUser.role ;

        return token ; 
      }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  })