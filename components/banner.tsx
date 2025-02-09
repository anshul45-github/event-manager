import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority"
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

const BannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80 border-yellow-30 text-primary",
                success: "bg-emerald-700 border-emerald-800 text-secondary",
            }
        },
        defaultVariants: {
            variant: "warning"
        }
    }
)

interface BannerProps extends VariantProps<typeof BannerVariants> {
    label: string;
};

const IconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon
}

export const Banner = ({ label, variant }: BannerProps) => {
    const Icon = IconMap[variant || "warning"];
    return (
        <div className={cn(BannerVariants({ variant }))}>
            <Icon className="h-4 w-4 mr-2" />
            {label}
        </div>
    )
}