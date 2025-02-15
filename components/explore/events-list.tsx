"use client";

import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/models/categories";
import { IconBadge } from "../icon-badge";
import { Calendar1Icon } from "lucide-react";

interface EventListProps {
    id: string;
    name: string;
    imageUrl: string;
    category: string;
    time: Date;
}

export const EventList = ({ id, name, imageUrl, category, time }: EventListProps) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(time));

    return (
        <Link href={`/events/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image fill className="object-cover" alt={name} src={imageUrl} />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {categories[parseInt(category) - 1].name}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={Calendar1Icon} />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}