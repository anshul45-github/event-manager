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

interface TimeFormProps {
    initialData: {
        time: Date;
    };
    eventId: string;
}

const formSchema = z.object({
    time: z.date().min(new Date(), "Event time must be in the future"),
})

export const TimeForm = ({ initialData, eventId }: TimeFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting } = form.formState;

    const router = useRouter();

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            const response = await fetch(`/api/events/time/${eventId}`, {
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
                Event time
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit time
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.time && "text-slate-500 italic")}>
                    {initialData.time ? initialData.time.toDateString() : "No time set"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="time" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker
                                          label="Event time"
                                          value={value}
                                          onChange={(newValue) => {
                                            setValue(newValue);
                                            field.onChange(newValue?.toDate());
                                          }}
                                        />
                                      </DemoContainer>
                                    </LocalizationProvider>
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