import ConfirmationAlertDialog from "@/components/common/ConfirmationAlertDialog";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import {
    useDeleteBasketEntryMutation,
    useDeleteBasketMutation,
    useGetBasketAllergensQuery,
    useGetBasketDetailsQuery,
    useGetBasketNutritionsQuery,
} from "@/redux/services/basketService.ts";
import { returnIndexValue } from "@/utils/productUtils";
import { CopyIcon, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NutritionChart from "./NutritionChart";
import NutrtitionsTable from "./NutritionsTable";
import UpdateQuantityDialog from "./UpdateQuantityDialog";
import { format } from "date-fns";
import CloneBasketDialog from "./CloneBasketDialog";
import EditBasketDialog from "./EditBasketDialog";

const BasketDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { data: basket, isLoading: isLoadingDetails } = useGetBasketDetailsQuery(id!, {
        skip: !id,
    });
    const { data: nutritions, isLoading: isLoadingNutritions } = useGetBasketNutritionsQuery(id!, {
        skip: !id,
    });
    const { data: allergens, isLoading: isLoadingAllergens } = useGetBasketAllergensQuery(id!, {
        skip: !id,
    });
    const [deleteEntry] = useDeleteBasketEntryMutation();
    const [deleteBasket] = useDeleteBasketMutation();
    const navigate = useNavigate();
    const breadcrumbs = useBreadcrumbs([
        { title: "NutriXplorer", path: "/" },
        { title: "Koszyki", path: "/baskets" },
        { title: basket?.name || "Koszyk", path: `/baskets/${id}` },
    ]);
    const [open, setOpen] = useState(false);
    const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
    const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [entryId, setEntryId] = useState<string | null>(null);
    const [currentQuantity, setCurrentQuantity] = useState<number>(0);
    const [unit, setUnit] = useState<string>("");
    const handleDeleteEntry = (id: string) => {
        deleteEntry(id);
    };

    const hadleDeleteBasket = (id: string) => {
        deleteBasket(id);
        setOpen(!open);
        navigate("/baskets");
    };

    const handleUpdateQuantity = (id: string, quantity: number, unit: string) => {
        setEntryId(id);
        setCurrentQuantity(quantity);
        setQuantityDialogOpen(true);
        setUnit(unit);
    };

    return (
        <div className="flex w-full justify-center">
            <UpdateQuantityDialog
                open={quantityDialogOpen}
                onClose={() => setQuantityDialogOpen(false)}
                currentQuantity={currentQuantity}
                entryId={entryId || ""}
                unit={unit}
            />

            <div className="container flex flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                    {breadcrumbs}
                    {basket && (
                        <div className="flex">
                            <Button
                                onClick={() => setEditDialogOpen(true)}
                                variant="ghost"
                                className="gap-2">
                                <CopyIcon /> Duplikuj koszyk
                            </Button>
                            <ConfirmationAlertDialog
                                open={open}
                                setOpen={() => setOpen(!open)}
                                onConfirm={() => hadleDeleteBasket(basket?.id)}
                                content="Czy na pewno chcesz usunąć ten koszyk?"
                                title="Czy jesteś pewny"
                                confirmContent="Usuń">
                                <Trash2Icon />
                                <p>Usuń koszyk</p>
                            </ConfirmationAlertDialog>
                            <Button
                                variant="ghost"
                                className="gap-2"
                                onClick={() => setEditDialogOpen(true)}>
                                <PencilIcon />
                                Edytuj koszyk
                            </Button>
                        </div>
                    )}
                </div>

                {isLoadingDetails ? (
                    <Spinner />
                ) : (
                    basket && (
                        <>
                            <Card>
                                <div className="flex justify-between">
                                    <CardHeader>
                                        <CardTitle className="text-3xl">{basket?.name}</CardTitle>
                                        <CardDescription>{basket?.description}</CardDescription>
                                    </CardHeader>
                                    <div className="flex flex-col justify-center pr-6 text-sm text-muted-foreground">
                                        <p>{"Data utworzenia: "}</p>
                                        <p>{format(basket.createdAt, "dd.MM.yyyy H:m")} </p>
                                    </div>
                                </div>
                            </Card>
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
                                                    <TableCell>
                                                        {entry.product.productName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.product.productDescription}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {returnIndexValue(
                                                            "T",
                                                            entry.productIndexes
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {returnIndexValue(
                                                            "S",
                                                            entry.productIndexes
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.units} {entry.product.unit}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0">
                                                                    <span className="sr-only">
                                                                        Open menu
                                                                    </span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>
                                                                    Akcje
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/products/${entry.product.id}`
                                                                        )
                                                                    }>
                                                                    Szczegóły produktu
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDeleteEntry(entry.id)
                                                                    }>
                                                                    Usuń z koszyka
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        handleUpdateQuantity(
                                                                            entry.id,
                                                                            entry.units,
                                                                            entry.product.unit
                                                                        );
                                                                    }}>
                                                                    Zmień ilość
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <CloneBasketDialog
                                basketId={basket?.id}
                                currentName={basket.name}
                                onClose={() => setCloneDialogOpen(false)}
                                open={cloneDialogOpen}
                            />
                            <EditBasketDialog
                                basketId={basket.id}
                                currentName={basket.name}
                                currentDescription={basket.description}
                                onClose={() => setEditDialogOpen(false)}
                                open={editDialogOpen}
                            />
                        </>
                    )
                )}
                {isLoadingNutritions || isLoadingAllergens ? (
                    <Spinner />
                ) : (
                    <div className="flex w-full flex-wrap gap-3">
                        <div className="min-w-[400px] flex-1 basis-0">
                            <NutrtitionsTable nutritions={nutritions || []} />
                        </div>
                        <div className="flex min-w-[400px] flex-1 basis-0 flex-col gap-3">
                            <NutritionChart
                                carbs={
                                    nutritions?.find(
                                        (nutr) =>
                                            nutr.groupName === "Węglowodany" &&
                                            nutr.name === "Total"
                                    )?.quantity || 0
                                }
                                fat={
                                    nutritions?.find(
                                        (nutr) =>
                                            nutr.groupName === "Tłuszcz" && nutr.name === "Total"
                                    )?.quantity || 0
                                }
                                protein={
                                    nutritions?.find((nutr) => nutr.name === "Białko")?.quantity ||
                                    0
                                }
                                fibre={
                                    nutritions?.find((nutr) => nutr.name === "Błonnik")?.quantity ||
                                    0
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
                )}
            </div>
        </div>
    );
};

export default BasketDetails;
