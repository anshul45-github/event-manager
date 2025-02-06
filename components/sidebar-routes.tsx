"use client";
import { Compass, Layout } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const routes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Explore",
        href: "/explore"
    }
]

export const SidebarRoutes = () => {
    const sidebarRoutes = routes;
    return (
        <div className="flex flex-col w-full">
            {sidebarRoutes.map((route, index) => (
                <SidebarItem key={index} icon={route.icon} label={route.label} href={route.href} />
            ))}
        </div>
    )
}