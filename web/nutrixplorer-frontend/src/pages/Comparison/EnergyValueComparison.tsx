import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

type EnergyValueComparisonProps = {
    energyValues: {
        carbs: number;
        fat: number;
        protein: number;
        fibre: number;
    }[];
};

const energyNutritions = [
    {
        name: "Total",
        groupName: "Tłuszcz",
        keyName: "fat",
        multiplier: 9,
    },
    {
        name: "Total",
        groupName: "Węglowodany",
        keyName: "carbs",
        multiplier: 4,
    },
    { name: "Białko", groupName: "Białko", multiplier: 4, keyName: "protein" },
    { name: "Błonnik", groupName: "Błonnik", multiplier: 2, keyName: "fibre" },
];

const EnergyValueComparison = ({ energyValues }: EnergyValueComparisonProps) => {
    const [totalList, setTotalList] = useState<number[]>([]);

    useEffect(() => {
        const total = energyValues.map((energyValue) => {
            return (
                energyValue.carbs * 4 +
                energyValue.fat * 9 +
                energyValue.protein * 4 +
                energyValue.fibre * 2
            );
        });
        setTotalList(total);
        return () => {};
    }, []);
    console.log(energyValues);
    console.log((energyValues.at(0)!["carbs"] / totalList[0]) * 100);
    return (
        <>
            <Table>
                <TableBody>
                    {energyNutritions.map((nutrition, index) => (
                        <TableRow key={index}>
                            <TableHead className="w-2/12">{nutrition.groupName}</TableHead>
                            {energyValues.map((energyValue, index) => (
                                <TableCell className="w-5/12" key={index}>
                                    {(
                                        ((energyValue[
                                            nutrition.keyName as keyof typeof energyValue
                                        ] *
                                            nutrition.multiplier) /
                                            totalList[index]) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default EnergyValueComparison;
