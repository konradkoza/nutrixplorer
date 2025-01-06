import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BasketNutritions } from "@/types/BasketTypes";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";
import { Label, LabelList, Pie, PieChart } from "recharts";

type FatChartProps = {
    nutritions: BasketNutritions[];
};

const FatChart = ({ nutritions }: FatChartProps) => {
    const [t, i18n] = useTranslation(TranslationNS.Baskets);
    const total =
        nutritions?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Total")
            ?.quantity || 0;

    const sat =
        nutritions?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Kwasy nasycone")
            ?.quantity || 0;

    const chartConfig = {
        fat: {
            label: t("nonSaturatedFats"),
            color: "hsl(var(--chart-3))",
        },
        saturated: {
            label: t("saturatedFats"),
            color: "hsl(var(--chart-4))",
        },
    } satisfies ChartConfig;

    const chartData = [
        {
            nutrition: "fat",
            value: total - sat,
            fill: "var(--color-fat)",
        },
        {
            nutrition: "saturated",
            value: sat,
            fill: "var(--color-saturated)",
        },
    ];
    return (
        <Card className="flex min-w-[370px] flex-grow flex-col">
            <CardHeader className="items-center">
                <CardTitle>Tłuszcz</CardTitle>
            </CardHeader>
            <CardContent className="mb-0 flex-1">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-96 max-h-[450px] [&_.recharts-text]:fill-foreground">
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
                                                    {total.toLocaleString(i18n.language, {
                                                        minimumFractionDigits: 1,
                                                        maximumFractionDigits: 1,
                                                    }) + " g"}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy || 0}
                                                    className="fill-muted-foreground">
                                                    {t("totalFat")}
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
            </CardContent>
        </Card>
    );
};

export default FatChart;
