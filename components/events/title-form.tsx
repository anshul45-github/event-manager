"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "ZOD";
import { useForm } from "react-hook-form";

import { Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

interface TitleFormProps {
    initialData: {
        name: string;
    };
    eventId: string;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    })
})

export const TitleForm = ({ initialData, eventId }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting } = form.formState;

    const router = useRouter();

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            const response = await fetch(`/api/events/name/${eventId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if(!response.ok) {
                throw new Error("Something went wrong");
            }
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
                Event name
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit name
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.name}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="e.g. 'Annual conference'" {...field} />

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