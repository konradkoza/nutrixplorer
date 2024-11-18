import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    useGetBasketAllergensQuery,
    useGetBasketDetailsQuery,
    useGetBasketNutritionsQuery,
} from "@/redux/services/basketService.ts";
import { MoreHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import NutritionChart from "./NutritionChart";
import NutrtitionsTable from "./NutritionsTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { returnIndexValue } from "@/utils/productUtils";

const BasketDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { data: basket } = useGetBasketDetailsQuery(id!, {
        skip: !id,
    });
    const { data: nutritions } = useGetBasketNutritionsQuery(id!, {
        skip: !id,
    });
    const { data: allergens } = useGetBasketAllergensQuery(id!, {
        skip: !id,
    });
    const navigate = useNavigate();

    return (
        <div className="flex w-full justify-center">
            <div className="container flex flex-col gap-3">
                <p className="font-semi-bold mt-5 text-3xl">{basket?.name}</p>
                <p className="text-md mb-5 text-muted-foreground">{basket?.description}</p>
                <Card>
                    <CardHeader>
                        <p className="text-2xl">Produkty w koszyku</p>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nazwa</TableHead>
                                    <TableHead>Opis</TableHead>
                                    <TableHead align="center">Indeks FF</TableHead>
                                    <TableHead align="center">Indeks SUM</TableHead>
                                    <TableHead>Ilość w koszyku</TableHead>
                                    <TableHead align="right" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {basket?.basketEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{entry.product.productName}</TableCell>
                                        <TableCell>{entry.product.productDescription}</TableCell>
                                        <TableCell align="center">
                                            {returnIndexValue("T", entry.productIndexes)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {returnIndexValue("S", entry.productIndexes)}
                                        </TableCell>
                                        <TableCell>
                                            {entry.units} {entry.product.unit}
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            navigate(
                                                                `/products/${entry.product.id}`
                                                            )
                                                        }>
                                                        Szczegóły produktu
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        Usuń z koszyka
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Zmień ilość</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="flex w-full flex-wrap gap-3">
                    <div className="min-w-[400px] flex-1 basis-0">
                        <NutrtitionsTable nutritions={nutritions || []} />
                    </div>
                    <div className="flex min-w-[400px] flex-1 basis-0 flex-col gap-3">
                        <NutritionChart
                            carbs={
                                nutritions?.find(
                                    (nutr) =>
                                        nutr.groupName === "Węglowodany" && nutr.name === "Total"
                                )?.quantity || 0
                            }
                            fat={
                                nutritions?.find(
                                    (nutr) => nutr.groupName === "Tłuszcz" && nutr.name === "Total"
                                )?.quantity || 0
                            }
                            protein={
                                nutritions?.find((nutr) => nutr.name === "Białko")?.quantity || 0
                            }
                            fibre={
                                nutritions?.find((nutr) => nutr.name === "Błonnik")?.quantity || 0
                            }
                            // total={
                            //     nutritions?.find((nutr) => nutr.name === "Wartość Energetyczna")
                            //         ?.quantity || 0
                            // }
                        />
                        <Card>
                            <CardHeader>
                                <p className="text-2xl">Alergeny</p>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc space-y-2 pl-5">
                                    {allergens?.map((allergen) => (
                                        <li
                                            className="text-lg text-muted-foreground"
                                            key={allergen}>
                                            {allergen}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default BasketDetails;
