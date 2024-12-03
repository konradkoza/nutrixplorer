import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BasketNutritions } from "@/types/BasketTypes";
import Indicator from "../../components/common/Indicator";

type NutritionsTableProps = {
    nutritions: BasketNutritions[];
};

type SimpleNutritionElements = {
    name: string;
    group: string;
    displayName?: string;
    showIfZero?: boolean;
    variantConsists?: "red" | "yellow" | "green" | null;
    variantNotConsists?: "red" | "yellow" | "green" | null;
};

export const simpleNutritionTable: SimpleNutritionElements[] = [
    {
        name: "Wartość Energetyczna",
        group: "Wartość Energetyczna",
        variantConsists: null,
        variantNotConsists: null,
    },
    {
        name: "Total",
        group: "Tłuszcz",
        displayName: "Tłuszcz",
        variantConsists: "yellow",
        variantNotConsists: "green",
    },
    {
        name: "Kwasy nasycone",
        group: "Tłuszcz",
        displayName: "w tym kwasy tłuszczowe nasycone",
        variantConsists: "red",
        variantNotConsists: "green",
    },
    {
        name: "Total",
        group: "Węglowodany",
        displayName: "Węglowodany",
        variantConsists: "yellow",
    },
    {
        name: "Cukry",
        group: "Węglowodany",
        displayName: "w tym cukry",
        variantConsists: "red",
        variantNotConsists: "green",
    },
    { name: "Białko", group: "Białko", variantConsists: "green", variantNotConsists: "red" },
    { name: "Sól", group: "Sól", variantConsists: "red", variantNotConsists: "green" },
    { name: "Błonnik", group: "Błonnik", variantConsists: "green", variantNotConsists: "red" },
];

const NutrtitionsTable = ({ nutritions }: NutritionsTableProps) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <p className="text-2xl">Sumaryczna wartość odżywcza</p>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead align="left" className="w-8"></TableHead>
                            <TableHead align="left">Wartość odżywcza</TableHead>
                            <TableHead>Sumaryczna wartość</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {simpleNutritionTable.map((element) => {
                            const nutrition = nutritions.find(
                                (nutrition) =>
                                    nutrition.name === element.name &&
                                    nutrition.groupName === element.group
                            );
                            return (
                                <TableRow key={element.name + element.group}>
                                    <TableCell align="left">
                                        {element.name !== "Wartość Energetyczna" && (
                                            <Indicator
                                                variant={(() => {
                                                    const nutr = simpleNutritionTable.find(
                                                        (n) =>
                                                            n.name === element.name &&
                                                            n.group === element.group
                                                    );
                                                    if (
                                                        (nutrition
                                                            ? Number(nutrition.quantity)
                                                            : 0) > 0
                                                    ) {
                                                        return nutr?.variantConsists || "green";
                                                    }
                                                    return nutr?.variantNotConsists || "green";
                                                })()}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {element.displayName ? element.displayName : element.name}
                                    </TableCell>
                                    <TableCell>
                                        {nutrition ? Number(nutrition.quantity.toFixed(2)) : 0}{" "}
                                        {nutrition ? nutrition.unit : ""}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {nutritions
                            .filter((nutr) => {
                                return !simpleNutritionTable.some((simpleElement) => {
                                    return nutr.name === simpleElement.name;
                                });
                            })
                            .map((nutrition) => (
                                <TableRow key={nutrition.name + nutrition.groupName}>
                                    <TableCell align="left">
                                        <Indicator
                                            variant={
                                                simpleNutritionTable.find(
                                                    (n) =>
                                                        n.name === nutrition.name &&
                                                        n.group === nutrition.groupName
                                                )?.variantConsists || "green"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{nutrition.name}</TableCell>
                                    <TableCell>
                                        {nutrition ? Number(nutrition.quantity.toFixed(2)) : 0}{" "}
                                        {nutrition ? nutrition.unit : ""}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default NutrtitionsTable;
