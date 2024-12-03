import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type GradientBarProps = {
    value: number;
    max: number;
    unit?: string;
    width?: string; // Optional className prop
    barHeight?: string; // Optional className prop
    height?: string; // Optional className prop
    variant?: keyof typeof variants;
    label?: string;
};

const variants = {
    greenToRed: "from-green-700 via-yellow-300 to-red-600",
    redToGreen: "from-red-600 via-yellow-300 to-green-700",
    greenToGreen: "from-green-300 to-green-700",
    blueToGreen: "from-blue-300 to-green-600",
    greenToLightGreen: "from-green-700 via-green-500 to-green-300",
    greenToYellow: "from-green-700 via-yellow-500 to-yellow-300",
};

const GradientBar = ({
    value,
    max,
    unit,
    width,
    barHeight,
    height,
    variant,
    label,
}: GradientBarProps) => {
    const percentage = Math.min(100, (value / max) * 100);

    return (
        <TooltipProvider>
            <Tooltip>
                <p className="mt-3 justify-self-start font-bold">{label}</p>
                <TooltipTrigger className={cn(width || "w-full", height || "")}>
                    <div className={cn(`my-3 space-y-2`)}>
                        {/* Bar Container */}

                        <div
                            className={cn(
                                "relative w-full overflow-hidden rounded bg-white",
                                barHeight || "h-8"
                            )}>
                            {/* Grey part */}
                            <div
                                className="absolute h-full bg-gray-300"
                                style={{
                                    width: `${100 - percentage}%`,
                                    right: 0,
                                    borderRadius: percentage === 100 ? "0" : "0px 5px 5px 0px", // Rounded corners only on the right if not full
                                }}></div>
                            {/* Gradient-filled part */}

                            <div
                                className={cn(
                                    "absolute h-full w-full bg-gradient-to-r",
                                    variants[variant || "greenToRed"]
                                )}
                                style={{
                                    clipPath: `inset(0 ${100 - percentage}% 0 0)`, // Clip gradient to filled portion
                                }}></div>
                        </div>

                        {/* Scale */}
                        <div className="flex justify-between text-sm text-popover-foreground">
                            {Array.from({ length: 6 }, (_, i) => (
                                <span key={i}>
                                    {Math.round((max / 5) * i)} {unit || ""}
                                </span>
                            ))}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p className="text-sm font-bold text-popover-foreground">
                        {value.toFixed(2)} {unit || ""}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default GradientBar;
