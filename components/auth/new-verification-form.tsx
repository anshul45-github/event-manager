"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "./card-wrapper";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(async () => {
        if(token) {
            try {
                const response = await fetch('/api/new-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                })
                const data = await response.json();
                if(response.ok)
                    console.log("SUCCESS :", data);
                setSuccess(data.success);
                setError(data.error);
            }
            catch(error) {
                console.log(error);
            }
        }
        else {
            setError("Missing token!");
        }
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper header={"Confirming your verification"} backButtonLabel="Back to login" backButtonHref="/auth/login">
            <div className="flex items-center w-full justify-center">
                {!success && !error && (<BeatLoader />)}
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </CardWrapper>
    )
}