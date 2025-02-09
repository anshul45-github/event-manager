"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"

import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"

import Link from "next/link"

import event from "@/lib/models/events"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<typeof event>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
            <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    }
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
        return (
            <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Start Date & Time
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
        return (
            <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Published
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {
        const isPublished = row.getValue("isPublished") || false;
        return (
            <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
                {isPublished ? "Published" : "Draft"}
            </Badge>
        )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
        const { id } = row.original;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-4 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={"/organizer/events/" + id}>
                        <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
  },
];