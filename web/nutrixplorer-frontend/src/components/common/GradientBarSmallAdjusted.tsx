import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type GradientBarSmallProps = {
    value: number;
    max: number;
    className?: string;
    variant?: GradientBarVariants;
    unit?: string;
};

const variants = {
    greenToRed: "from-green-700 via-yellow-300 to-red-600",
    redToGreen: "from-red-600 via-yellow-300 to-green-700",
    greenToGreen: "from-green-300 to-green-700",
    blueToGreen: "from-blue-300 to-green-600",
    greenToLightGreen: "from-green-700 via-green-500 to-green-300",
    greenToYellow: "from-green-700 via-yellow-500 to-yellow-300",
};

function generateGradientBackground(max: number, value: number, variant: string) {
    const gradientVariants = {
        greenToRed: ["#047857", "#F59E0B", "#DC2626"], // from-green-700 via-yellow-600 to-red-600
        greenToLightGreen: ["#047857", "#10B981", "#86EFAC"], // from-green-700 via-green-500 to-green-300
        blueToGreen: ["#059669", "#93C5FD", "#3B82F6"],
    };

    const colors = gradientVariants[variant as keyof typeof gradientVariants];
    const percentage = ((value / max) * 100).toFixed(0);
    const percentage1 = ((value / max + 0.05) * 100).toFixed(0);

    return `linear-gradient(to right, ${colors[0]} 0%, ${colors[1]} ${percentage}%, ${colors[2]} ${percentage1}%)`;
}

export type GradientBarVariants = keyof typeof variants;

const GradientBarSmallAdjusted = ({
    value,
    max,
    className,
    variant,
    unit,
}: GradientBarSmallProps) => {
    const total = value > 2 * max ? value : 2 * max;
    const percentage = (value / total) * 100;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    className={cn("relative overflow-hidden rounded bg-white", className || "")}>
                    <div
                        className={cn(
                            "relative overflow-hidden rounded bg-white",
                            className || ""
                        )}>
                        {/* Red line indicator */}
                        <div
                            style={{
                                left: `${((max / total) * 100).toFixed(0)}%`,
                            }}
                            className="absolute z-[5] h-full w-[3px] bg-black"
                        />
                        {/* Grey part */}
                        <div
                            className="absolute h-full bg-gray-300"
                            style={{
                                width: `${100 - percentage}%`,
                                right: 0,
                                borderRadius: percentage === 100 ? "0" : "0px 4px 4px 0px", // Rounded corners only on the right if not full
                            }}
                        />
                        {/* Gradient-filled part */}
                        <div
                            className={cn(
                                "absolute h-full w-full"
                                // variants[variant || "greenToRed"]
                            )}
                            style={{
                                background: generateGradientBackground(
                                    total,
                                    max,
                                    variant || "greenToRed"
                                ),
                                clipPath: `inset(0 ${100 - percentage}% 0 0)`, // Clip gradient to filled portion
                            }}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p className="text-sm font-bold text-popover-foreground">
                        {value.toFixed(2)} {unit || ""} ({((value / max) * 100).toFixed(2)}%RWS)
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default GradientBarSmallAdjusted;
