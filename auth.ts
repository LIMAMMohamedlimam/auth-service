import authConfig from "@/auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "@/data/user"
import NextAuth, {type DefaultSession} from "next-auth" 
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { StringToBoolean } from "class-variance-authority/types"
import { getAccountByUserId } from "./data/account"


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

        if(!user.id) return false ; 
        // Prevent sign in wihtout email verification
        //if (user.id) {
          const existingUser = await getUserById(user.id) ;
          if(!existingUser?.emailVerified) return false ;
        

        // TODO: Add 2FA check

        if(existingUser.isTwoFactorEnabled){
          const twoFactorConfirmation = await 
                      getTwoFactorConfirmationByUserId(existingUser.id);
          if(!twoFactorConfirmation) return false ; 
          // Deleting two factor confirmtion for next sign in 
          await db.twoFactorConfirmation.delete({
            where : {id : twoFactorConfirmation.id}
          });
          
          
        }

        //}

        return true ;
      },

      async session ({token , session }){
        if (token.sub && session.user) {
          session.user.id = token.sub ;
        }
        if(session.user) {
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean ; 
          session.user.name = token.name ;
          session.user.email = token.email as string ;
          session.user.isOauth = token.isOauth as boolean ;
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

        const existingUser  = await getUserById(token.sub) ;

        if(!existingUser) return token ;

        const existingAccount = await getAccountByUserId(existingUser.id) ;

        token.isOauth = !!existingAccount; 
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role ;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled ;

        return token ; 
      }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  })