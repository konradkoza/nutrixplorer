import { NutritionalIndex, ProductIndex } from "@/types/ProductTypes.ts";
import { useEffect, useState } from "react";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, YAxis, XAxis, CartesianGrid } from "recharts";

const chartConfig = {
    value: {
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

type ProductIndexesProps = {
    indexes: ProductIndex[];
    nutritionalIndexes: NutritionalIndex[];
};

const ProductIndexes = ({
    indexes,
    nutritionalIndexes,
}: ProductIndexesProps) => {
    const returnIndexValue = (indexName: string) => {
        const index = indexes.find((index) => index.indexName === indexName);
        if (index) {
            return index.indexValue;
        } else {
            return 0;
        }
    };
    const [chartData, setChartData] = useState<ProductIndex[]>([]);

    useEffect(() => {
        setChartData([
            { indexName: "EN", indexValue: returnIndexValue("E") },
            { indexName: "VIT", indexValue: returnIndexValue("V") },
            { indexName: "MIN", indexValue: returnIndexValue("M") },
            { indexName: "OM3", indexValue: returnIndexValue("O") },
            { indexName: "PRT", indexValue: returnIndexValue("P") },
            { indexName: "FIB", indexValue: returnIndexValue("F") },
            { indexName: "SUM", indexValue: returnIndexValue("S") },
            { indexName: "FF", indexValue: returnIndexValue("T") },
        ]);
    }, []);

    // const chartData = [
    //     { indexName: "Indeks EN", indexValue: returnIndexValue("E") },
    //     { indexName: "Indeks VIT", indexValue: returnIndexValue("V") },
    //     { indexName: "Indeks MIN", indexValue: returnIndexValue("M") },
    //     { indexName: "Indeks OM3", indexValue: returnIndexValue("O") },
    //     { indexName: "Indeks PRT", indexValue: returnIndexValue("P") },
    //     { indexName: "Indeks FIB", indexValue: returnIndexValue("F") },
    //     { indexName: "Indeks SUM", indexValue: returnIndexValue("S") },
    //     { indexName: "Indeks FF", indexValue: returnIndexValue("T") },
    // ];

    return (
        <div>
            {chartData.length > 0 && (
                <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical">
                        <YAxis
                            dataKey="indexName"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <XAxis
                            type="number"
                            dataKey="indexValue"
                            tickLine={true}
                            tickCount={
                                Math.max(
                                    ...chartData.map((data) => data.indexValue)
                                ) + 1
                            }
                            domain={[
                                0,
                                Math.max(
                                    ...chartData.map((data) => data.indexValue)
                                ),
                            ]}
                        />
                        <CartesianGrid horizontal={false} />
                        <Bar
                            dataKey="indexValue"
                            fill="var(--color-value)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            )}
            <p>Indeks EN: {returnIndexValue("E")}</p>
            <p>Indeks VIT: {returnIndexValue("V")}</p>
            <p>Indeks MIN: {returnIndexValue("M")}</p>
            <p>Indeks OM3: {returnIndexValue("O")}</p>
            <p>Indeks PRT: {returnIndexValue("P")}</p>
            <p>Indeks FIB: {returnIndexValue("F")}</p>
            <p>Indeks SUM: {returnIndexValue("S")}</p>
            <p>Indeks FF: {returnIndexValue("T")}</p>
            {nutritionalIndexes.map((index) => (
                <>
                    {index.legend && (
                        <p key={index.legend}>
                            {index.legend}: {index.indexValue}
                        </p>
                    )}
                </>
            ))}
        </div>
    );
};

export default ProductIndexes;
