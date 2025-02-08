"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import * as z from "ZOD";
import { zodResolver } from "@hookform/resolvers/zod";

import { newPasswordSchema } from "@/lib/authSchema";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { useRouter, useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
    const token = useSearchParams().get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof newPasswordSchema>) => {
        try {
            const response = await fetch("/api/new-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values, token: token }),
            });
            const data = await response.json();
            if(data.error) {
                setError(data.error);
                setSuccess(undefined);
            }
            else {
                setError(undefined);
                setSuccess(data.success);
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <CardWrapper header="Enter a new password" backButtonLabel="Back to login" backButtonHref="/auth/login">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
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
                            Reset password
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}