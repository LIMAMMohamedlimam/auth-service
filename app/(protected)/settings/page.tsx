"use client";

import { logout } from "@/actions/logout";
import { CurrentUser } from "@/hooks/use-current-user";

const SettingsPage =  () => {
  const user = CurrentUser() ;
  const onClick=async () => {
    logout() ;
  }
  return (
    <div className="bg-white p-10 rounded-xl">
        {JSON.stringify(user)}
          <button onClick={onClick} type='submit'>
            Sign out
          </button>
    </div>
  )
}

export default SettingsPage