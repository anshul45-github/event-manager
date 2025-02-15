"use client";

import * as z from "ZOD";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface ImageFormProps {
    initialData: {
        imageUrl: string;
    };
    eventId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, "Image is required"),
})

export const ImageForm = ({ initialData, eventId }: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            await fetch(`/api/events/imageUrl/${eventId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            toast.success("Event updated");
            toggleEdit();
            router.refresh();
        }
        catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Event image
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image alt="Upload" fill className="object-cover rounded-md" src={initialData.imageUrl} />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <UploadDropzone endpoint={"eventImage"} onClientUploadComplete={(res) => {
                        onSubmit({ imageUrl: res[0].ufsUrl });
                    }} onUploadError={(error: Error) => {
                        toast.error(error?.message);
                    }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        Image must be a PNG, JPG, or GIF file. Maximum size of 4MB. 16:9 aspect ratio recommended.
                    </div>
                </div>
            )}
        </div>
    )
}