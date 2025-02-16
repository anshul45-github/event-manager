"use client";

import toast from "react-hot-toast";

import { useForm } from "react-hook-form";

import * as z from "ZOD";

import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
})

const CreatePage = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            console.log(data);
            router.push(`/organizer/events/${data.id}`);
            toast.success("Event created");
        }
        catch(error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Name your event
                </h1>
                <p className="text-sm text-slate-600">
                    Enter name of the event. Don&apos;t worry, you can change this later.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="e.g. 'Annual Conference'" {...field} />
                                </FormControl>
                                <FormDescription>
                                    What is this event about?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex items-center gap-x-2">
                            <Link href={"/"}>
                                <Button type="button" variant={"ghost"}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreatePage