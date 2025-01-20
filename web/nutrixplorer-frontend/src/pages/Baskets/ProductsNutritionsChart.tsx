import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BasketEntry } from "@/types/BasketTypes";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Text } from "recharts";
type ProductsNutritionsChartProps = {
    basketEntries: BasketEntry[];
};

const ProductsNutritionsChart = ({ basketEntries }: ProductsNutritionsChartProps) => {
    const [t] = useTranslation(TranslationNS.Baskets);
    const chartData = basketEntries.map((entry) => ({
        name: entry.product.productName,
        carbs:
            (entry.product.nutritionalValues.find(
                (value) =>
                    value.nutritionalValueName.name === "Total" &&
                    value.nutritionalValueName.group === "Węglowodany"
            )?.quantity || 0) *
            (entry.product.unit === "l" ? (1000 * entry.units) / 100 : entry.units / 100),
        fat:
            (entry.product.nutritionalValues.find(
                (value) =>
                    value.nutritionalValueName.name === "Total" &&
                    value.nutritionalValueName.group === "Tłuszcz"
            )?.quantity || 0) *
            (entry.product.unit === "l" ? (1000 * entry.units) / 100 : entry.units / 100),
        protein:
            (entry.product.nutritionalValues.find(
                (value) => value.nutritionalValueName.name === "Białko"
            )?.quantity || 0) *
            (entry.product.unit === "l" ? (1000 * entry.units) / 100 : entry.units / 100),
        fiber:
            (entry.product.nutritionalValues.find(
                (value) => value.nutritionalValueName.name === "Błonnik"
            )?.quantity || 0) *
            (entry.product.unit === "l" ? (1000 * entry.units) / 100 : entry.units / 100),
        salt:
            (entry.product.nutritionalValues.find(
                (value) => value.nutritionalValueName.name === "Sól"
            )?.quantity || 0) *
            (entry.product.unit === "l" ? (1000 * entry.units) / 100 : entry.units / 100),
    }));

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
        salt: {
            label: t("salt"),
            color: "hsl(var(--chart-5))",
        },
    } satisfies ChartConfig;

    const CustomXAxisTick = ({ x, y, payload }: any) => {
        if (payload && payload.value) {
            return (
                <Text width={65} x={x} y={y} textAnchor="middle" verticalAnchor="start">
                    {payload.value}
                </Text>
            );
        }
        return null;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("productsNutrTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer className="aspect-square max-h-[550px] w-full" config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            interval={0}
                            tick={<CustomXAxisTick />}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent className="w-44" hideLabel />}
                        />
                        <ChartLegend content={<ChartLegendContent className="mt-24" />} />
                        <YAxis unit={"g"} />
                        {Object.keys(chartConfig).map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a"
                                fill={`var(--color-${key})`}
                                radius={[0, 0, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default ProductsNutritionsChart;
