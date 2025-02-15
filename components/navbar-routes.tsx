"use client";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { UserButton } from "@clerk/nextjs";

export const NavbarRoutes = () => {
    const pathname = usePathname();
    const isOrganizerPage = pathname?.startsWith("/organizer");
    const isSearchPage = pathname === "/explore";
    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isOrganizerPage ? (
                    <Link href={"/"}>
                        <Button size={"sm"} variant={"ghost"}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : (
                    <Link href={"/organizer/events"}>
                        <Button size={"sm"} variant={"ghost"}>
                            Organizer Mode
                        </Button>
                    </Link>
                )}
                <UserButton afterSwitchSessionUrl="/" />
            </div>
        </>
    )
}