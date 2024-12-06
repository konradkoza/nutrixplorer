import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Basket } from "@/types/BasketTypes";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type IndexComparisonChartProps = {
    baskets: Basket[];
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
    const chartData = productIndexes.map((index) => ({
        name: "Indeks " + index.displayName,
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
    console.log(chartData);
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
