import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, LabelList, Pie, PieChart } from "recharts";

type NutritionChartProps = {
    carbs: number;
    fat: number;
    protein: number;
    fibre: number;
};

const chartConfig = {
    carbs: {
        label: "Węglowodany",
        color: "hsl(var(--chart-1))",
    },
    fat: {
        label: "Tłuszcz",
        color: "hsl(var(--chart-2))",
    },
    protein: {
        label: "Białko",
        color: "hsl(var(--chart-3))",
    },
    fibre: {
        label: "Błonnik",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

const NutritionChart = ({
    carbs,
    fat,
    protein,
    fibre,
}: NutritionChartProps) => {
    const total = carbs * 4 + fat * 9 + protein * 4 + fibre * 2;
    const chartData = [
        {
            nutrition: "carbs",
            value: carbs,
            multiplier: 4,
            fill: "var(--color-carbs)",
        },
        {
            nutrition: "fat",
            value: fat,
            multiplier: 9,
            fill: "var(--color-fat)",
        },
        {
            nutrition: "protein",
            value: protein,
            multiplier: 4,
            fill: "var(--color-protein)",
        },
        {
            nutrition: "fibre",
            value: fibre,
            multiplier: 2,
            fill: "var(--color-fibre)",
        },
    ];

    return (
        <div className="w-full">
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-10">
                    <CardTitle>
                        Udział wartości odżywczych w wartości energetycznej
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[260px] [&_.recharts-text]:fill-foreground">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        formatter={(value, name) =>
                                            `${chartConfig[name as keyof typeof chartConfig].label}: ${value} g`
                                        }
                                    />
                                }
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="nutrition"
                                stroke="0"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}>
                                <LabelList
                                    offset={10}
                                    dataKey="nutrition"
                                    className="fill-foreground"
                                    stroke="none"
                                    fontSize={12}
                                    position="outside"
                                    formatter={(value: string) => {
                                        const element = chartData.find(
                                            (element) =>
                                                element.nutrition === value
                                        );
                                        let sum = chartData.reduce(
                                            (acc, curr) =>
                                                acc +
                                                curr.value * curr.multiplier,
                                            0
                                        );
                                        return `${(((element!.value * element!.multiplier) / sum) * 100).toFixed(2)}%`;
                                    }}
                                />
                                <Label
                                    content={({ viewBox }) => {
                                        if (
                                            viewBox &&
                                            "cx" in viewBox &&
                                            "cy" in viewBox
                                        ) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold">
                                                        {Math.floor(
                                                            total
                                                        ).toString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className="fill-muted-foreground">
                                                        Kcal
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                            <ChartLegend
                                content={
                                    <ChartLegendContent nameKey="nutrition" />
                                }
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default NutritionChart;
