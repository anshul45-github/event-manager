import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
    children: React.ReactNode;
    header: string;
    backButtonLabel: string;
    backButtonHref: string;
}

export const CardWrapper = ({ children, header, backButtonLabel, backButtonHref }: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={header} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
}