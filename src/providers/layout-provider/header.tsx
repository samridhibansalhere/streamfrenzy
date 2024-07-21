import { IUser } from "@/interfaces/users";
import { useAuth } from "@clerk/nextjs";
import { message } from "antd";
import { LogOut, User2, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import AdminSidebar from "./admin-sidebar";

function Header({ loggedInUser }: { loggedInUser: IUser }) {
  const [showAdminSidebar, setShowAdminSidebar] = React.useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const onUserClick = () => {
    if (loggedInUser.isAdmin) {
      setShowAdminSidebar(!showAdminSidebar);
    } else {
      router.push("/profile");
    }
  };

  const onLogout = async () => {
    try {
      await signOut();
      message.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <div className="p-5 bg-black text-white flex justify-between items-center">
      <h1
        className="flex font-bold gap-2 text-2xl items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        STREAM <Video className="text-orange-500" /> FRENZY
      </h1>

      <div
        className="flex gap-3 items-center cursor-pointer text-white-300"
        onClick={onUserClick}
      >
        <User2 className="text-white-300" size={16} />
        <span className="text-sm uppercase">
          {loggedInUser?.username} {loggedInUser?.isAdmin && "(Admin)"}
        </span>

        {!loggedInUser?.isAdmin && (
          <LogOut size={20} className="ml-10" onClick={onLogout} />
        )}
      </div>

      {showAdminSidebar && (
        <AdminSidebar
          setShowAdminSidebar={setShowAdminSidebar}
          showAdminSidebar={showAdminSidebar}
        />
      )}
    </div>
  );
}

export default Header;