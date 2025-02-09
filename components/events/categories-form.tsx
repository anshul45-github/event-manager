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

import dayjs, { Dayjs } from 'dayjs';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Combobox } from "../ui/combobox";

interface CategoryFormProps {
    initialData: {
        categoryId: string;
    };
    eventId: string;
    options: { label: string; value: string }[];
}

const formSchema = z.object({
    categoryId: z.string().min(1),
})

export const CategoryForm = ({ initialData, eventId, options }: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData.categoryId || "",
        }
    });

    const { isSubmitting } = form.formState;

    const router = useRouter();

    const selectedOption = options.find((option) => option.value === initialData.categoryId);

    console.log(selectedOption);

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            const response = await fetch(`/api/events/categoryId/${eventId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if(response.ok) {
                toast.success("Event updated");
                toggleEdit();
                router.refresh();
            }
            else
                toast.error("Something went wrong");
        }
        catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Event category
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>
                    {selectedOption ? selectedOption?.label : "No category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox options={options} {...field} />
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