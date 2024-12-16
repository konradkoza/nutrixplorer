import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { NutritionalValue, Portion } from "@/types/ProductTypes";

type NutritionTableProps = {
    nutritions: NutritionalValue[];
    portion: Portion;
};

type SimpleNutritionElements = {
    name: string;
    group: string;
    displayName?: string;
    showIfZero?: boolean;
};

const SimpleNutritionTable: SimpleNutritionElements[] = [
    {
        name: "Wartość Energetyczna",
        group: "Wartość Energetyczna",
    },
    {
        name: "Total",
        group: "Tłuszcz",
        displayName: "Tłuszcz",
    },
    {
        name: "Kwasy nasycone",
        group: "Tłuszcz",
        displayName: "w tym kwasy tłuszczowe nasycone",
    },
    {
        name: "Total",
        group: "Węglowodany",
        displayName: "Węglowodany",
    },
    {
        name: "Cukry",
        group: "Węglowodany",
        displayName: "w tym cukry",
    },
    { name: "Białko", group: "Białko" },
    { name: "Błonnik", group: "Błonnik" },
    { name: "Sól", group: "Sól" },
];

const NutritionTable = ({ nutritions, portion }: NutritionTableProps) => {
    return (
        <Table className="mt-4">
            <TableHeader className="w-full">
                <TableRow>
                    <TableHead className="">Wartość odżywcza</TableHead>
                    <TableHead>100 {portion.unit}</TableHead>
                    <TableHead>
                        Porcja ({portion.portionQuantity} {portion.unit})
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {SimpleNutritionTable.map((element) => {
                    const nutrition = nutritions.find(
                        (nutrition) =>
                            nutrition.nutritionalValueName.name === element.name &&
                            nutrition.nutritionalValueName.group === element.group
                    );
                    return (
                        <TableRow key={element.name + element.group}>
                            <TableCell>
                                {element.displayName ? element.displayName : element.name}
                            </TableCell>
                            <TableCell>
                                {nutrition ? nutrition.quantity.toFixed(2) : 0}{" "}
                                {nutrition ? nutrition.unit : ""}
                            </TableCell>
                            <TableCell>
                                {nutrition
                                    ? (
                                          (nutrition.quantity / 100) *
                                          portion.portionQuantity
                                      ).toFixed(2)
                                    : 0}{" "}
                                {nutrition ? nutrition.unit : ""}
                            </TableCell>
                        </TableRow>
                    );
                })}
                {nutritions
                    .filter((nutr) => {
                        return !SimpleNutritionTable.some((simpleElement) => {
                            return nutr.nutritionalValueName.name === simpleElement.name;
                        });
                    })
                    .map((nutrition) => (
                        <TableRow
                            key={
                                nutrition.nutritionalValueName.name +
                                nutrition.nutritionalValueName.group
                            }>
                            <TableCell>{nutrition.nutritionalValueName.name}</TableCell>
                            <TableCell>
                                {nutrition ? nutrition.quantity.toFixed(2) : 0}{" "}
                                {nutrition
                                    ? nutrition.unit === "mcg"
                                        ? "μg"
                                        : nutrition.unit
                                    : ""}
                            </TableCell>
                            <TableCell>
                                {nutrition
                                    ? (
                                          (nutrition.quantity / 100) *
                                          portion.portionQuantity
                                      ).toFixed(2)
                                    : 0}{" "}
                                {nutrition
                                    ? nutrition.unit === "mcg"
                                        ? "μg"
                                        : nutrition.unit
                                    : ""}
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
};

export default NutritionTable;
