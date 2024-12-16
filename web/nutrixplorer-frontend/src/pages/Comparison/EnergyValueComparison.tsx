import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { TranslationNS } from "@/types/TranslationNamespaces";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type EnergyValueComparisonProps = {
    energyValues: {
        carbs: number;
        fat: number;
        protein: number;
        fiber: number;
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
    { name: "Błonnik", groupName: "Błonnik", multiplier: 2, keyName: "fiber" },
];

const EnergyValueComparison = ({ energyValues }: EnergyValueComparisonProps) => {
    const [totalList, setTotalList] = useState<number[]>([]);
    const [t] = useTranslation(TranslationNS.Comparison);
    useEffect(() => {
        const total = energyValues.map((energyValue) => {
            return (
                energyValue.carbs * 4 +
                energyValue.fat * 9 +
                energyValue.protein * 4 +
                energyValue.fiber * 2
            );
        });
        setTotalList(total);
        return () => {};
    }, []);
    return (
        <>
            <Table>
                <TableBody>
                    {energyNutritions.map((nutrition, index) => (
                        <TableRow key={index}>
                            <TableHead className="w-2/12">{t(nutrition.keyName)}</TableHead>
                            {energyValues.map((energyValue, index) => (
                                <TableCell className="w-5/12" key={index + "comparison"}>
                                    {totalList[index] !== 0
                                        ? (
                                              ((energyValue[
                                                  nutrition.keyName as keyof typeof energyValue
                                              ] *
                                                  nutrition.multiplier) /
                                                  totalList[index]) *
                                              100
                                          ).toFixed(1) + "%"
                                        : "-"}
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
