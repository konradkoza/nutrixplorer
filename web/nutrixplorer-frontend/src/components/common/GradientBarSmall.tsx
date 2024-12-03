import { cn } from "@/lib/utils";

type GradientBarSmallProps = {
    value: number;
    max: number;
    className?: string;
    variant?: GradientBarVariants;
};

const variants = {
    greenToRed: "from-green-700 via-yellow-300 to-red-600",
    redToGreen: "from-red-600 via-yellow-300 to-green-700",
    greenToGreen: "from-green-300 to-green-700",
    blueToGreen: "from-blue-300 to-green-600",
    greenToLightGreen: "from-green-700 via-green-500 to-green-300",
    greenToYellow: "from-green-700 via-yellow-500 to-yellow-300",
};

export type GradientBarVariants = keyof typeof variants;

const GradientBarSmall = ({ value, max, className, variant }: GradientBarSmallProps) => {
    const percentage = Math.min(100, (value / max) * 100);

    return (
        <div className={cn("relative overflow-hidden rounded bg-white", className || "")}>
            {/* Grey part */}
            <div
                className="absolute h-full bg-gray-300"
                style={{
                    width: `${100 - percentage}%`,
                    right: 0,
                    borderRadius: percentage === 100 ? "0" : "0px 4px 4px 0px", // Rounded corners only on the right if not full
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
    );
};

export default GradientBarSmall;
