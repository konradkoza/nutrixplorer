import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BasketNutritions } from "@/types/BasketTypes";
import { Label, LabelList, Pie, PieChart } from "recharts";

type ComparisonCarbsChartProps = {
    nutritions: BasketNutritions[];
};

const chartConfig = {
    carbs: {
        label: "Inne węglowodany",
        color: "hsl(var(--chart-1))",
    },
    sugar: {
        label: "Cukry",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const ComparisonCarbsChart = ({ nutritions }: ComparisonCarbsChartProps) => {
    const total =
        nutritions?.find((nutr) => nutr.groupName === "Węglowodany" && nutr.name === "Total")
            ?.quantity || 0;

    const sugar =
        nutritions?.find((nutr) => nutr.groupName === "Węglowodany" && nutr.name === "Cukry")
            ?.quantity || 0;

    const chartData = [
        {
            nutrition: "carbs",
            value: total - sugar,
            fill: "var(--color-carbs)",
        },
        {
            nutrition: "sugar",
            value: sugar,
            fill: "var(--color-sugar)",
        },
    ];
    return (
        <ChartContainer
            config={chartConfig}
            className="m-0 mx-auto aspect-square h-96 max-h-[450px] [&_.recharts-text]:fill-foreground">
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            formatter={(value, name) =>
                                `${chartConfig[name as keyof typeof chartConfig].label}: ${Number(value).toFixed(0)} g`
                            }
                        />
                    }
                />
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="nutrition"
                    stroke="0"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={120}
                    outerRadius={140}>
                    <LabelList
                        offset={14}
                        dataKey="nutrition"
                        className="fill-foreground"
                        stroke="none"
                        fontSize={16}
                        position="outside"
                        formatter={(value: string) => {
                            const element = chartData.find(
                                (element) => element.nutrition === value
                            );
                            return `${((element!.value / total) * 100).toFixed(1)}%`;
                        }}
                    />
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) - 16}
                                        textAnchor="middle"
                                        dominantBaseline="middle">
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) - 24}
                                            className="fill-foreground text-3xl font-bold">
                                            {total.toFixed(2) + " g"}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy || 0}
                                            className="fill-muted-foreground">
                                            Węglowodany w sumie
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </Pie>
                <ChartLegend
                    content={<ChartLegendContent nameKey="nutrition" />}
                    className="mt-[-140px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
        </ChartContainer>
    );
};

export default ComparisonCarbsChart;
