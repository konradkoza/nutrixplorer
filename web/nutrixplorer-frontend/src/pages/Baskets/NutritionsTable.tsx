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

type NutritionsTableProps = {
    nutritions: BasketNutritions[];
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
    { name: "Sól", group: "Sól" },
    { name: "Błonnik", group: "Błonnik" },
];

const NutrtitionsTable = ({ nutritions }: NutritionsTableProps) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <p className="text-2xl">Sumaryczne wartości odżywcze</p>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Wartość odżywcza</TableHead>
                            <TableHead>Sumaryczna wartość</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SimpleNutritionTable.map((element) => {
                            const nutrition = nutritions.find(
                                (nutrition) =>
                                    nutrition.name === element.name &&
                                    nutrition.groupName === element.group
                            );
                            return (
                                <TableRow key={element.name + element.group}>
                                    <TableCell>
                                        {element.displayName
                                            ? element.displayName
                                            : element.name}
                                    </TableCell>
                                    <TableCell>
                                        {nutrition
                                            ? Number(
                                                  nutrition.quantity.toFixed(2)
                                              )
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
                                        return nutr.name === simpleElement.name;
                                    }
                                );
                            })
                            .map((nutrition) => (
                                <TableRow
                                    key={nutrition.name + nutrition.groupName}>
                                    <TableCell>{nutrition.name}</TableCell>
                                    <TableCell>
                                        {nutrition
                                            ? Number(
                                                  nutrition.quantity.toFixed(2)
                                              )
                                            : 0}{" "}
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
