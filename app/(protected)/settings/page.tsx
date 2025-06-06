"use client";

import { settings } from "@/actions/settings";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/use-current-user";
import { currentRole, currentUser } from "@/lib/auth";
import { UserRole } from "@/lib/generated/prisma";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

import { z } from "zod";




const SettingsPage =  () => {

  const user = useCurrentUser() ; 
  const [error , setError] = useState<string|undefined>() ;
  const [success , setSuccess] = useState<string|undefined>() ;
  const [isPending , startTransition] = useTransition() ;
  const { update } = useSession() ;
 
   


  console.log(`user: ${JSON.stringify(user)}`) ;
  /* if (!user){ 
    return (
      <ClipLoader
      color="#6de88c"
      size={38} 
      />)} ; */

    /* while(user == undefined) {
      const user = currentUser() ;
      return (
        <ClipLoader 
        color="#6de88c"
        size={38} 
        />
      )
    } */

    if (user === undefined) {
      // Still fetching, React will re-render when it resolves
      
      return (<div>
        <p className="text-center">Loading user...</p>
        <ClipLoader />
      </div>
       );
    }
    
    if (user === null) {
      // Auth failed or not signed in
      return <p className="text-center text-destructive">You must be signed in</p>;
    }
    

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver : zodResolver(SettingsSchema),
    defaultValues: {
      name : user?.name || undefined , 
      email : user?.email || undefined,
      password : undefined,
      newPassword : undefined ,
      role : user?.role || undefined,
      isTwoFactorEnabled : user?.isTwoFactorEnabled || undefined ,
    }
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if(data.error){
            setError(data.error) ;
          }
          if(data.success){
            form.reset() ;
            update();
            setSuccess(data.success) ;
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        })
    });
  }

  
  
  return (
     <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center" >
          ⚙️ Settings
        </p>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Form {...form}>
          <form 
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
            <FormField 
              control ={form.control} 
              name = "name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder = "Jhon Doe"
                      disabled = {isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {user?.isOauth == false && ( 
            <>
              <FormField 
                control ={form.control} 
                name = "email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder = "JhonDoe@example.com"
                        type='email'
                        disabled = {isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control ={form.control} 
                name = "password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder = "********"
                        type='password'
                        disabled = {isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control ={form.control} 
                name = "newPassword"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder = "********"
                        type='password'
                        disabled = {isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            )}
            <FormField 
              control ={form.control} 
              name = "role"
              render={({field}) => (
                <FormItem >
                  <FormLabel>Role</FormLabel>
                  <Select 
                    disabled = {isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role"/>
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN} >
                        Admin
                      </SelectItem>
                      <SelectItem value={UserRole.USER} >
                        User
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {user?.isOauth == false && ( 
            <FormField 
              control ={form.control} 
              name = "isTwoFactorEnabled"
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between
                rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable 2FA for your account
                    </FormDescription>
                  </div>
                  <FormControl>
                      <Switch 
                        disabled={isPending}
                        checked = {field.value}
                        onCheckedChange={field.onChange}
                      />
                  </FormControl>
                </FormItem>
              )}
            />
            )}
            </div>
            <FormError  message={error} />
            <FormSuccess  message={success} />
            <Button type="submit">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
     </Card>
  )
}

export default SettingsPage