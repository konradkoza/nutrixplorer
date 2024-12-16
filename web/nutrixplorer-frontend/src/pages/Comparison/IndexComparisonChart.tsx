import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Basket } from "@/types/BasketTypes";
import { TranslationNS } from "@/types/TranslationNamespaces";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type IndexComparisonChartProps = {
    baskets: Basket[];
};

const productIndexes = [
    { name: "V", displayName: "VIT" },
    { name: "M", displayName: "MIN" },
    { name: "O", displayName: "OM3" },
    { name: "P", displayName: "PRT" },
    { name: "F", displayName: "FIB" },
    { name: "S", displayName: "SUM" },
    { name: "T", displayName: "FF" },
];

const IndexComparisonChart = ({ baskets }: IndexComparisonChartProps) => {
    const [t] = useTranslation(TranslationNS.Comparison);

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

    const chartData = productIndexes.map((index) => ({
        name: t("index") + " " + index.displayName,
        basket1: baskets[0].basketEntries
            .map((entry) => entry.productIndexes)
            .reduce((acc, curr) => {
                return (
                    acc +
                    (curr.find((element) => element.indexName === index.name)?.indexValue || 0)
                );
            }, 0),
        basket2: baskets[1].basketEntries
            .map((entry) => entry.productIndexes)
            .reduce((acc, curr) => {
                return (
                    acc +
                    (curr.find((element) => element.indexName === index.name)?.indexValue || 0)
                );
            }, 0),
    }));
    return (
        <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="basket1" fill="var(--color-basket1)" radius={4} />
                <Bar dataKey="basket2" fill="var(--color-basket2)" radius={4} />
                <ChartLegend className="mt-8" content={<ChartLegendContent />} />
            </BarChart>
        </ChartContainer>
    );
};

export default IndexComparisonChart;
