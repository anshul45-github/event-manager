"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import * as z from "ZOD";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/lib/authSchema";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        }
    })

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            setError(data.error);
            setSuccess(data.success);
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <CardWrapper header="Create an account" backButtonLabel="Already have an account" backButtonHref="/auth/login">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="john.doe@example.com" type="email" {...field} />
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
                                        <Input disabled={isSubmitting} placeholder="******" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button disabled={isSubmitting} type="submit" className="w-full">
                            Create an account
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}