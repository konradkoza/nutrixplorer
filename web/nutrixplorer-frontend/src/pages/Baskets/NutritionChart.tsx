import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { LabelList, Pie, PieChart } from "recharts";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";

type NutritionChartProps = {
    carbs: number;
    fat: number;
    protein: number;
    fiber: number;
    poliole?: number;
};

const NutritionChart = ({ carbs, fat, protein, fiber, poliole }: NutritionChartProps) => {
    const { t } = useTranslation(TranslationNS.Baskets);
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
            nutrition: "fiber",
            value: fiber,
            multiplier: 2,
            fill: "var(--color-fiber)",
        },
    ];
    const chartConfig = {
        carbs: {
            label: t("carbs"),
            color: "hsl(var(--chart-1))",
        },
        fat: {
            label: t("fat"),
            color: "hsl(var(--chart-2))",
        },
        protein: {
            label: t("protein"),
            color: "hsl(var(--chart-3))",
        },
        fiber: {
            label: t("fiber"),
            color: "hsl(var(--chart-4))",
        },
    } satisfies ChartConfig;

    const sum = poliole
        ? chartData.reduce((acc, curr) => acc + curr.value * curr.multiplier, 0) - poliole * 1.6
        : chartData.reduce((acc, curr) => acc + curr.value * curr.multiplier, 0);

    return (
        <div className="w-full">
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-10">
                    <CardTitle>{t("nutritionChartTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[450px] [&_.recharts-text]:fill-foreground">
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
                                innerRadius={0}
                                outerRadius={160}
                                paddingAngle={0}>
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

                                        let percentage;
                                        if (poliole && element!.nutrition === "carbs") {
                                            percentage =
                                                ((element!.value * element!.multiplier -
                                                    poliole * 1.6) /
                                                    sum) *
                                                100;

                                            if (percentage < 0.05) {
                                                return "";
                                            }
                                            return `${percentage.toFixed(1)}%`;
                                        } else {
                                            percentage =
                                                ((element!.value * element!.multiplier) / sum) *
                                                100;
                                            if (percentage < 0.05) {
                                                return "";
                                            }
                                            return `${percentage.toFixed(1)}%`;
                                        }
                                    }}
                                />
                                {/* <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                                                        {Math.floor(total).toString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground">
                                                        Kcal
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                /> */}
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="nutrition" />}
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
