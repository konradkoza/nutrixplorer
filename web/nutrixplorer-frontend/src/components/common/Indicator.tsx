import { cn } from "@/lib/utils";

type IndicatorProps = {
    variant: "red" | "yellow" | "green";
};

const Indicator = ({ variant }: IndicatorProps) => {
    return (
        <div
            className={cn(
                `h-3 w-3 rounded-full`,
                variant === "green" && "bg-green-500",
                variant === "red" && "bg-red-500",
                variant === "yellow" && "bg-yellow-500"
            )}
            aria-hidden="true"></div>
    );
};

export default Indicator;
