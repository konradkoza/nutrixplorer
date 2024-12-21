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

function generateGradientBackground(max: number, value: number, variant: string) {
    const gradientVariants = {
        greenToRed: ["#047857", "#F59E0B", "#DC2626"], // from-green-700 via-yellow-600 to-red-600
        greenToLightGreen: ["#047857", "#10B981", "#86EFAC"], // from-green-700 via-green-500 to-green-300
        blueToGreen: ["#93C5FD", "#3B82F6", "#059669"],
    };

    const colors = gradientVariants[variant as keyof typeof gradientVariants];
    const percentage = ((value / max) * 100).toFixed(0);
    const percentage1 = ((value / max + 0.05) * 100).toFixed(0);

    console.log("percentage", percentage);
    return `linear-gradient(to right, ${colors[0]} 0%, ${colors[1]} ${percentage}%, ${colors[2]} ${percentage1}%)`;
}

export type GradientBarVariants = keyof typeof variants;

const GradientBarSmall = ({ value, max, className, variant }: GradientBarSmallProps) => {
    const percentage = Math.min(100, (value / max) * 100);

    return (
        <div className={cn("relative overflow-hidden rounded bg-white", className || "")}>
            <div
                style={{
                    left: `${(0.5 * 100).toFixed(0)}%`,
                }}
                className="absolute z-[5] h-full w-[2px] bg-black"
            />
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
                className={cn("absolute h-full w-full")}
                style={{
                    background: generateGradientBackground(2 * max, max, variant || "greenToRed"),
                    clipPath: `inset(0 ${100 - percentage}% 0 0)`, // Clip gradient to filled portion
                }}></div>
        </div>
    );
};

export default GradientBarSmall;
