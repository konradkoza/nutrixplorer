import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

type GradientBarProps = {
    value: number;
    max: number;
    unit?: string;
    width?: string;
    barHeight?: string;
    height?: string;
    variant?: keyof typeof variants;
    label?: string;
};

const variants = {
    greenToRed: "from-green-700  via-yellow-600  to-red-600 ",
    redToGreen: "from-red-600 via-yellow-300 to-green-700",
    greenToGreen: "from-green-300 to-green-700",
    blueToGreen: "from-blue-300 to-green-600",
    greenToLightGreen: "from-green-700 via-green-500 to-green-300",
    greenToYellow: "from-green-700 via-yellow-500 to-yellow-300",
};

function generateGradientBackground(max: number, value: number, variant: string) {
    const gradientVariants = {
        greenToRed: ["#047857", "#F59E0B", "#DC2626"],
        greenToLightGreen: ["#047857", "#10B981", "#86EFAC"],
        blueToGreen: ["#059669", "#93C5FD", "#3B82F6"],
    };

    const colors = gradientVariants[variant as keyof typeof gradientVariants];
    const percentage = ((value / max) * 100).toFixed(0);
    const percentage1 = ((value / max + 0.02) * 100).toFixed(0);

    return `linear-gradient(to right, ${colors[0]} 0%, ${colors[1]} ${percentage}%, ${colors[2]} ${percentage1}%)`;
}

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
    const [t] = useTranslation(TranslationNS.RWS);
    const total = value > 2 * max ? value : 2 * max;
    const percentage = (value / total) * 100;

    return (
        <TooltipProvider>
            <Tooltip>
                <p className="mt-3 justify-self-start font-bold">{label}</p>
                <TooltipTrigger className={cn(width || "w-full", height || "")}>
                    <div className={cn(`relative my-3 space-y-2`)}>
                        <div
                            style={{
                                left: `${((max / total) * 100).toFixed(0)}%`,
                            }}
                            className={cn(`absolute z-[5] w-1 bg-black`, barHeight || "h-8")}></div>
                        <div
                            className={cn(
                                "relative w-full overflow-hidden rounded bg-white",
                                barHeight || "h-8"
                            )}>
                            <div
                                className="absolute h-full bg-gray-300"
                                style={{
                                    width: `${100 - percentage}%`,
                                    right: 0,
                                    borderRadius: percentage === 100 ? "0" : "0px 5px 5px 0px",
                                }}></div>

                            <div
                                className={cn("absolute h-full w-full bg-gradient-to-r")}
                                style={{
                                    backgroundImage: generateGradientBackground(
                                        total,
                                        max,
                                        variant || "greenToRed"
                                    ),
                                    clipPath: `inset(0 ${100 - percentage}% 0 0)`,
                                }}></div>
                        </div>

                        {/* Scale */}
                        <div className="flex justify-between text-sm text-popover-foreground">
                            {Array.from({ length: 7 }, (_, i) => (
                                <span key={i}>
                                    {Math.round((total / 6) * i)} {unit || ""}
                                </span>
                            ))}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p className="text-sm font-bold text-popover-foreground">
                        {value.toFixed(2)} {unit || ""} ({((value / max) * 100).toFixed(2)}
                        {t("rws")})
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default GradientBar;
