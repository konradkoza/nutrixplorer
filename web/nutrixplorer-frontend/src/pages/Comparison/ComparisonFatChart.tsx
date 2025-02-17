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

type ComparisonFatChartProps = {
    nutritions: BasketNutritions[];
};

const ComparisonFatChart = ({ nutritions }: ComparisonFatChartProps) => {
    const [t, i18n] = useTranslation(TranslationNS.Comparison);
    const total =
        nutritions?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Total")
            ?.quantity || 0;

    const sat =
        nutritions?.find((nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Kwasy nasycone")
            ?.quantity || 0;

    const chartConfig = {
        fat: {
            label: t("nonSaturated"),
            color: "hsl(var(--chart-3))",
        },
        saturated: {
            label: t("saturated"),
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
                            return `${((element!.value / total) * 100).toLocaleString(
                                i18n.language,
                                {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                }
                            )}%`;
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
                                            {t("fatSummary")}
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

export default ComparisonFatChart;
