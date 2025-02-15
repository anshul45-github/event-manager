"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "ZOD";
import { useForm } from "react-hook-form";

import { Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
    initialData: {
        fee: number;
    };
    eventId: string;
}

const formSchema = z.object({
    fee: z.coerce.number(),
})

export const PriceForm = ({ initialData, eventId }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fee: initialData?.fee || undefined,
        }
    });

    const { isSubmitting } = form.formState;

    const router = useRouter();

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            const response = await fetch(`/api/events/fee/${eventId}`, {
                method: 'PATCH',
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

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Event fee
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit fee
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.fee && "text-slate-500 italic")}>
                    {initialData.fee ? formatPrice(initialData.fee) : "No fee set"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="fee" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} type="number" step={"0.01"} placeholder="Set a fee for your input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={isSubmitting} type="submit"> Save </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}