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

type ComparisonRadarChartProps = {
    nutritions: BasketNutritions[][];
};

const chartConfig = {
    basket1: {
        label: "Koszyk 1",
        color: "hsl(var(--chart-1))",
    },
    basket2: {
        label: "Koszyk 2",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const ComparisonRadarChart = ({ nutritions }: ComparisonRadarChartProps) => {
    const chartData = [
        {
            name: "Węglowodany",
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
            name: "Tłuszcz",
            basket1:
                nutritions[0]?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Total")
                    ?.quantity || 0,
            basket2:
                nutritions[1]?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Total")
                    ?.quantity || 0,
        },
        {
            name: "Białko",
            basket1: nutritions[0]?.find((nutr) => nutr.name === "Białko")?.quantity || 0,
            basket2: nutritions[1]?.find((nutr) => nutr.name === "Białko")?.quantity || 0,
        },
        {
            name: "Błonnik",
            basket1: nutritions[0]?.find((nutr) => nutr.name === "Błonnik")?.quantity || 0,
            basket2: nutritions[1]?.find((nutr) => nutr.name === "Błonnik")?.quantity || 0,
        },
        {
            name: "Sól",
            basket1: nutritions[0]?.find((nutr) => nutr.name === "Sól")?.quantity || 0,
            basket2: nutritions[1]?.find((nutr) => nutr.name === "Sól")?.quantity || 0,
        },
    ];

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
