import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const BackgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100",
            },
            size: {
                default: "p-2",
                sm: "p-1",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }
);

const IconVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success: "text-emerald-700",
            },
            size: {
                default: "h-8 w-8",
                sm: "h-4 w-4",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }
);

type BackgroundVariantsProps = VariantProps<typeof BackgroundVariants>;
type IconVariantProps = VariantProps<typeof IconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantProps {
    icon: LucideIcon;
};

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
    return (
        <div className={cn((BackgroundVariants({ variant, size })))}>
            <Icon className={cn(IconVariants({ variant, size }))} />
        </div>
    )
}