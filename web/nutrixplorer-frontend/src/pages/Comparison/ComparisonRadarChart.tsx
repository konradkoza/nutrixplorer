import { BasketNutritions } from "@/types/BasketTypes";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

type ComparisonRadarChartProps = {
    nutritions: BasketNutritions[][];
};

const ComparisonRadarChart = ({ nutritions }: ComparisonRadarChartProps) => {
    const [t] = useTranslation(TranslationNS.Comparison);
    const chartData = [
        {
            name: t("carbs"),
            basket1:
                nutritions[0]?.find(
                    (nutr) => nutr.groupName === "Węglowodany" && nutr.name === "Total"
                )?.quantity || 0,
            basket2:
                nutritions[1]?.find(
                    (nutr) => nutr.groupName === "Węglowodany" && nutr.name === "Total"
                )?.quantity || 0,
        },
        {
            name: t("fat"),
            basket1:
                nutritions[0]?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Total")
                    ?.quantity || 0,
            basket2:
                nutritions[1]?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Total")
                    ?.quantity || 0,
        },
        {
            name: t("protein"),
            basket1: nutritions[0]?.find((nutr) => nutr.name === "Białko")?.quantity || 0,
            basket2: nutritions[1]?.find((nutr) => nutr.name === "Białko")?.quantity || 0,
        },
        {
            name: t("fiber"),
            basket1: nutritions[0]?.find((nutr) => nutr.name === "Błonnik")?.quantity || 0,
            basket2: nutritions[1]?.find((nutr) => nutr.name === "Błonnik")?.quantity || 0,
        },
        {
            name: t("salt"),
            basket1: nutritions[0]?.find((nutr) => nutr.name === "Sól")?.quantity || 0,
            basket2: nutritions[1]?.find((nutr) => nutr.name === "Sól")?.quantity || 0,
        },
    ];

    const chartConfig = {
        basket1: {
            label: t("basket1"),
            color: "hsl(var(--chart-1))",
        },
        basket2: {
            label: t("basket2"),
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[800px] w-full p-5">
            <RadarChart
                data={chartData}
                margin={{
                    top: -40,
                    bottom: -10,
                }}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={54} stroke="hsla(var(--foreground))" orientation="middle" />
                <PolarGrid />
                <Radar dataKey="basket1" fill="var(--color-basket1)" fillOpacity={0.6} />
                <Radar dataKey="basket2" fill="var(--color-basket2)" fillOpacity={0.7} />
                <ChartLegend className="mt-8" content={<ChartLegendContent />} />
            </RadarChart>
        </ChartContainer>
    );
};

export default ComparisonRadarChart;
