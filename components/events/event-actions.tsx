"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { ConfirmModal } from "../confirm-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EventActionsProps {
    disabled: boolean;
    eventId: string;
    isPublished: boolean;
}

export const EventActions = ({ disabled, eventId, isPublished }: EventActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            if(!isPublished) {
                const response = await fetch(`/api/events/${eventId}/publish`, {
                    method: "PATCH",
                });
                if(response.ok)
                    toast.success("Event published successfully.");
            }
            else if(isPublished) {
                const response = await fetch(`/api/events/${eventId}/unpublish`, {
                    method: "PATCH",
                });
                if(response.ok)
                    toast.success("Event unpublished successfully.");
            }
            router.refresh();
        }
        catch(error) {
            console.log(error);
            toast.error("An error occurred while publishing the event.");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: "DELETE"
            });
            if(response.ok) {
                toast.success("Event deleted successfully.");
                router.refresh();
                router.push("/organizer/events");
            }
            else
                toast.error("An error occurred while deleting the event.");
        }
        catch(error) {
            toast.error("An error occurred while deleting the event.");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} disabled={disabled || isLoading} variant={"outline"} size={"sm"}>
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onClick={onDelete}>
                <Button disabled={isLoading} size={"sm"}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}