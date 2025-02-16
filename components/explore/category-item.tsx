"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { IconType } from "react-icons";
import { FcCollaboration, FcConferenceCall, FcIdea, FcMultipleDevices, FcPodiumWithSpeaker, FcReading, FcShop } from "react-icons/fc";

const iconMap: Record<string, IconType> = {
    "Workshop": FcReading,
    "Networking Event": FcCollaboration,
    "Trade Show": FcShop,
    "Panel Discussion": FcConferenceCall,
    "Hackathon": FcIdea,
    "Social Event": FcMultipleDevices,
    "Conference": FcPodiumWithSpeaker,
}

interface CategoryItemProps {
    label: string;
    value?: string;
}

export const CategoryItem = ({ label, value }: CategoryItemProps) => {
    const Icon = iconMap[label];

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({ 
            url: pathname,
            query: {
                categoryId: isSelected ? null : value,
                title: currentTitle,
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    }

    return (
        <Suspense>
        <button onClick={onClick} className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition", isSelected && "border-sky-700 bg-sky-200/20 text-sky-800")}>
            <Icon size={20} />
            <div className="truncate">
                {label}
            </div>
        </button>
        </Suspense>
    )
}