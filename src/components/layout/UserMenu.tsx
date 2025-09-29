"use client";

import { useState, useEffect, useRef } from "react";
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
import { animate } from "motion";

export function UserMenu() {
  const { user, signOut } = useAuthContext();
  const { userXP, loading: xpLoading } = useExperience();
  const lastXPRef = useRef<number | null>(null);
  const didHydrateRef = useRef<boolean>(false);
  const xpAnchorRef = useRef<HTMLDivElement | null>(null);
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

  const triggerSparklesAtRect = (rect: DOMRect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = `${centerX}px`;
    wrapper.style.top = `${centerY}px`;
    wrapper.style.pointerEvents = "none";
    wrapper.style.zIndex = "9999";
    document.body.appendChild(wrapper);

    const NUM_SPARKLES = 5;
    const MAX_DISTANCE_PX = 96;
    const animations: Promise<void>[] = [];
    for (let i = 0; i < NUM_SPARKLES; i++) {
      const sparkle = document.createElement("span");
      sparkle.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="#fbbf24"><path d="M12 2l2.39 5.26L20 9l-5.2 2.26L12 16l-2.8-4.74L4 9l5.61-1.74L12 2z"/></svg>';
      sparkle.style.position = "absolute";
      sparkle.style.left = "0";
      sparkle.style.top = "0";
      wrapper.appendChild(sparkle);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * MAX_DISTANCE_PX;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      const p = animate(
        sparkle,
        {
          transform: [
            "translate(0px,0px) scale(1)",
            `translate(${x}px, ${y}px) scale(0)`,
          ],
          opacity: [1, 0],
        } as unknown as Record<string, unknown>,
        { duration: 2, ease: "easeOut" }
      ).finished.then(() => sparkle.remove());
      animations.push(p);
    }
    Promise.allSettled(animations).then(() => wrapper.remove());
  };

  // Fire sparkles when XP increases (ExperienceContext updated elsewhere)
  useEffect(() => {
    // Skip initial hydration/load so we don't fire on first fetch after F5
    if (!didHydrateRef.current && !xpLoading) {
      didHydrateRef.current = true;
      lastXPRef.current = userXP;
      return;
    }

    if (
      didHydrateRef.current &&
      lastXPRef.current !== null &&
      userXP > lastXPRef.current
    ) {
      const el = xpAnchorRef.current;
      if (el) {
        triggerSparklesAtRect(el.getBoundingClientRect());
      }
    }
    lastXPRef.current = userXP;
  }, [userXP, xpLoading]);

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
            <AvatarFallback className="bg-sky-500 text-white text-md">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="block text-left">
            <p className="text-md font-medium ">
              {aliasLoading ? "Carregando..." : userAlias}
            </p>
            <div ref={xpAnchorRef} className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-sm ">
                {xpLoading ? "..." : `${userXP.toLocaleString()} XP`}
              </span>
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {/* <p className="text-md font-medium leading-none">
              {aliasLoading ? "Carregando..." : userAlias}
            </p> */}
            <p className="text-sm leading-none text-muted-foreground">
              {user?.email}
            </p>
            {/* <div className="flex items-center space-x-1 mt-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {xpLoading ? "..." : `${userXP.toLocaleString()} XP`}
              </span>
            </div> */}
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
