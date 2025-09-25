"use client";

import { useState, useEffect } from "react";
//import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { useExperience } from "@/contexts/ExperienceContext";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Star /*, User, Settings, Crown*/ } from "lucide-react";

export function UserMenu() {
  const { user, signOut } = useAuthContext();
  const { userXP, loading: xpLoading } = useExperience();
  const [isOpen, setIsOpen] = useState(false);
  const [userAlias, setUserAlias] = useState<string>("");
  const [aliasLoading, setAliasLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState<number>(0);

  const avatar_path = "/imgs/avatars/";

  const userInitials = user?.user_metadata?.name
    ? user.user_metadata.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  const userName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  // Fetch user alias and avatar from profiles table
  useEffect(() => {
    const fetchUserProfileBits = async () => {
      if (!user?.id || !supabase) {
        setUserAlias(userName);
        setAliasLoading(false);
        setAvatarUrl(user?.user_metadata?.avatar_url || null);
        return;
      }

      try {
        setAliasLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("user_alias, avatar_url")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user alias:", error);
          setUserAlias(userName);
          setAvatarUrl(user?.user_metadata?.avatar_url || null);
        } else {
          setUserAlias(data?.user_alias || userName);
          setAvatarUrl(
            data?.avatar_url || user?.user_metadata?.avatar_url || null
          );
        }
      } catch (error) {
        console.error("Error fetching user alias:", error);
        setUserAlias(userName);
        setAvatarUrl(user?.user_metadata?.avatar_url || null);
      } finally {
        setAliasLoading(false);
      }
    };

    fetchUserProfileBits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userName]);

  // Realtime subscription to profile updates for immediate avatar refresh
  useEffect(() => {
    if (!user?.id || !supabase) return;

    type ProfileUpdatePayload = {
      new: {
        user_alias?: string | null;
        avatar_url?: string | null;
      };
    };

    const channel = supabase
      .channel(`profiles_avatar_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: ProfileUpdatePayload) => {
          const newAlias = payload.new?.user_alias ?? undefined;
          const newAvatar = payload.new?.avatar_url ?? undefined;
          if (newAlias !== undefined) {
            setUserAlias(newAlias || userName);
          }
          if (newAvatar !== undefined) {
            setAvatarUrl(newAvatar || null);
            // bump version to break cache if filename stays same by accident
            setAvatarVersion((v) => v + 1);
          }
        }
      )
      .subscribe();

    return () => {
      try {
        channel.unsubscribe();
      } catch {}
    };
  }, [user?.id, userName, user?.user_metadata?.avatar_url]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                avatarUrl
                  ? `${avatar_path}${avatarUrl}?v=${avatarVersion}`
                  : undefined
              }
              alt={userName}
            />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">
              {aliasLoading ? "Carregando..." : userAlias}
            </p>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-600">
                {xpLoading ? "..." : `${userXP.toLocaleString()} XP`}
              </span>
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {aliasLoading ? "Carregando..." : userAlias}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                {xpLoading ? "..." : `${userXP.toLocaleString()} XP`}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/*
        <DropdownMenuItem asChild>
          <Link href="/me" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/plans" className="flex items-center">
            <Crown className="mr-2 h-4 w-4" />
            <span>Upgrade Plan</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        */}
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Desconectar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
