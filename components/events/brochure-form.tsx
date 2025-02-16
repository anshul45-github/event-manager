"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "ZOD";
import { useForm } from "react-hook-form";

import { File, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";

interface BrochureFormProps {
    initialData: {
        brochureUrl: string;
    };
    eventId: string;
}

const formSchema = z.object({
    brochureUrl: z.string().min(1)
})

export const BrochureForm = ({ initialData, eventId }: BrochureFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting } = form.formState;

    const router = useRouter();

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            const response = await fetch(`/api/events/brochureUrl/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if(!response.ok)
                throw new Error("Something went wrong");
            toast.success("Event updated");
            toggleEdit();
            router.refresh();
        }
        catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (url: string) => {
        try {
            setDeleting(url);
            const response = await fetch(`/api/events/brochureUrl/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brochureUrl: url }),
            })
            if(!response.ok)
                throw new Error("Something went wrong");
            toast.success("Event updated");
            router.refresh();
        }
        catch {
            toast.error("Something went wrong");
        }
        finally {
            setDeleting(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Event brochure
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a brochure
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {!initialData.brochureUrl && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No brochure added yet
                        </p>
                    )}
                    {initialData.brochureUrl && (
                        <div className="space-y-2">
                            <div className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                <a href={initialData.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-xs line-clamp-1">
                                    {initialData.brochureUrl.split('/').pop() + ".pdf"}
                                </a>
                                {deleting && (
                                    <div>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                )}
                                {!deleting && (
                                    <button onClick={() => onDelete(initialData.brochureUrl)} className="ml-auto hover:opacity-75 transition">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <UploadDropzone endpoint={"brochure"} onClientUploadComplete={(res) => {
                        onSubmit({ brochureUrl: res[0].ufsUrl });
                    }} onUploadError={(error: Error) => {
                        toast.error(error?.message);
                    }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add a brochure to your event. This will be shown to attendees when they view your event.
                    </div>
                </div>
            )}
        </div>
    )
}