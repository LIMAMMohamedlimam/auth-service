import authConfig from "@/auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "@/data/user"
import NextAuth, {type DefaultSession} from "next-auth" 


declare module "@auth/core" {
  

  interface Session  {
    user : {
      id : string ,
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

    pages : {
      signIn : "/auth/login",
      error : "/auth/error" ,
    },

    events : {
      async linkAccount ({ user }){
        await db.user.update({
          where : {id : user.id},
          data : {emailVerified : new Date()}
        })
      }
    } ,

    callbacks : {

      async signIn({user , account}) {
        // Allow Oauth without email verification
        if(account?.provider !== "credentials") return true ;

        // Prevent sign in wihtout email verification
        if (user.id) {
          const existingUser = await getUserById(user.id) ;
          if(!existingUser?.emailVerified) return false ;
        }

        // TODO: Add 2FA check

        

        return true ;
      },

      async session ({token , session }){
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