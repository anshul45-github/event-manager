"use client";
import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

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
];

const OrganizerRoutes = [
    {
        icon: List,
        label: "Events",
        href: "/organizer/events"
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/organizer/analytics"
    }
]

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isOrganizerPage = pathname?.startsWith("/organizer");
    const sidebarRoutes = isOrganizerPage ? OrganizerRoutes : routes;
    return (
        <div className="flex flex-col w-full">
            {sidebarRoutes.map((route, index) => (
                <SidebarItem key={index} icon={route.icon} label={route.label} href={route.href} />
            ))}
        </div>
    )
}