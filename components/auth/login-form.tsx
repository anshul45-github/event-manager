"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import * as z from "ZOD";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/lib/authSchema";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { useRouter } from "next/navigation";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        try {
            const response = await fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if(data.error) {
                setError(data.error);
                setSuccess(undefined);
            }
            else {
                setError(undefined);
                setSuccess(data.success);
                if(data.loggedIn) {
                    router.push("/organizer");
                }
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <CardWrapper header="Please login to continue" backButtonLabel="Don't have an account" backButtonHref="/auth/register" showSocial>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="******" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}