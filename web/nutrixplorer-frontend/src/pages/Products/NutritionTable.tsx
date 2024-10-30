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
        showIfZero: true,
    },
    {
        name: "Total",
        group: "Tłuszcz",
        displayName: "Tłuszcz",
        showIfZero: true,
    },
    {
        name: "Kwasy nasycone",
        group: "Tłuszcz",
        displayName: "w tym kwasy tłuszczowe nasycone",
        showIfZero: true,
    },
    {
        name: "Total",
        group: "Węglowodany",
        displayName: "Węglowodany",
        showIfZero: true,
    },
    {
        name: "Cukry",
        group: "Węglowodany",
        displayName: "w tym cukry",
        showIfZero: true,
    },
    { name: "Białko", group: "Białko", showIfZero: true },
    { name: "Sól", group: "Sól", showIfZero: true },
    { name: "Błonnik", group: "Błonnik", showIfZero: false },
];

const NutritionTable = ({ nutritions, portion }: NutritionTableProps) => {
    return (
        <>
            <div>
                <Table>
                    <TableHeader className="w-full">
                        <TableRow>
                            <TableHead className="">Wartość odżywcza</TableHead>
                            <TableHead>100 {portion.unit}</TableHead>
                            <TableHead>
                                Porcja ({portion.portionQuantity} {portion.unit}
                                )
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SimpleNutritionTable.map((element) => {
                            const nutrition = nutritions.find(
                                (nutrition) =>
                                    nutrition.nutritionalValueName.name ===
                                        element.name &&
                                    nutrition.nutritionalValueName.group ===
                                        element.group
                            );
                            return !element.showIfZero && !nutrition ? null : (
                                <TableRow key={element.name + element.group}>
                                    <TableCell>
                                        {element.displayName
                                            ? element.displayName
                                            : element.name}
                                    </TableCell>
                                    <TableCell>
                                        {nutrition
                                            ? nutrition.quantity.toFixed(2)
                                            : 0}{" "}
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
                                return !SimpleNutritionTable.some(
                                    (simpleElement) => {
                                        return (
                                            nutr.nutritionalValueName.name ===
                                            simpleElement.name
                                        );
                                    }
                                );
                            })
                            .map((nutrition) => (
                                <TableRow
                                    key={
                                        nutrition.nutritionalValueName.name +
                                        nutrition.nutritionalValueName.group
                                    }>
                                    <TableCell>
                                        {nutrition.nutritionalValueName.name}
                                    </TableCell>
                                    <TableCell>
                                        {nutrition
                                            ? nutrition.quantity.toFixed(2)
                                            : 0}{" "}
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
                            ))}
                    </TableBody>
                    {/* <TableBody>
                        <>
                            {nutritions.map((nutrition) => {
                                const nutr = SimpleNutritionTable.find(
                                    (element) =>
                                        nutrition.nutritionalValueName.name ===
                                            element.name &&
                                        nutrition.nutritionalValueName.group ===
                                            element.group
                                );
                                console.log(nutr);
                                return (
                                    <TableRow
                                        key={
                                            nutrition.nutritionalValueName
                                                .name +
                                            nutrition.nutritionalValueName.group
                                        }>
                                        <TableCell>
                                            {nutr
                                                ? nutr.displayName
                                                    ? nutr.displayName
                                                    : nutr.name
                                                : nutrition.nutritionalValueName
                                                      .name}
                                        </TableCell>
                                        <TableCell>
                                            {nutrition
                                                ? nutrition.quantity.toFixed(2)
                                                : 0}{" "}
                                            {nutrition ? nutrition.unit : ""}
                                        </TableCell>
                                        <TableCell>
                                            {nutrition
                                                ? (
                                                      (nutrition.quantity /
                                                          100) *
                                                      portion.portionQuantity
                                                  ).toFixed(2)
                                                : 0}{" "}
                                            {nutrition ? nutrition.unit : ""}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    </TableBody> */}
                </Table>
            </div>
        </>
    );
};

export default NutritionTable;
