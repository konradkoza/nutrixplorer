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
import { format } from "date-fns";
import { CopyIcon, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CarbsChart from "./CarbsChart";
import CloneBasketDialog from "./CloneBasketDialog";
import EditBasketDialog from "./EditBasketDialog";
import FatChart from "./FatChart";
import NutritionChart from "./NutritionChart";
import NutrtitionsTable from "./NutritionsTable";
import ProductsNutritionsChart from "./ProductsNutritionsChart";
import RwsCard from "./RwsCard";
import UpdateQuantityDialog from "./UpdateQuantityDialog";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/types/TranslationNamespaces";

const BasketDetails = () => {
    const { t } = useTranslation(TranslationNS.Baskets);
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
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.baskets"), path: "/baskets" },
        { title: basket?.name || t("breadcrumbs.basket"), path: `/baskets/${id}` },
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
                                onClick={() => setCloneDialogOpen(true)}
                                variant="ghost"
                                className="gap-2">
                                <CopyIcon /> {t("duplicateBasket")}
                            </Button>
                            <ConfirmationAlertDialog
                                open={open}
                                setOpen={() => setOpen(!open)}
                                onConfirm={() => hadleDeleteBasket(basket?.id)}
                                content={t("deleteConfirmationContent")}
                                title={t("deleteConfirmationTitle")}
                                confirmContent={t("deleteConfirmationButton")}>
                                <Trash2Icon />
                                <p>{t("deleteBasket")}</p>
                            </ConfirmationAlertDialog>
                            <Button
                                variant="ghost"
                                className="gap-2"
                                onClick={() => setEditDialogOpen(true)}>
                                <PencilIcon />
                                {t("editBasket")}
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
                                        <p>{t("creationDate")}</p>
                                        <p>{format(basket.createdAt, "dd.MM.yyyy H:m")} </p>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <p className="text-2xl">{t("productsInBasket")}</p>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t("productName")}</TableHead>
                                                <TableHead>{t("productDescription")}</TableHead>
                                                <TableHead align="center">{t("ffIndex")}</TableHead>
                                                <TableHead align="center">
                                                    {t("sumIndex")}
                                                </TableHead>
                                                <TableHead>{t("quantityPerPackage")}</TableHead>
                                                <TableHead>{t("quantityInBasket")}</TableHead>
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
                                                        {entry.product.productQuantity}{" "}
                                                        {entry.product.unit}
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
                                                                        {t("openMenu")}
                                                                    </span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>
                                                                    {t("actions")}
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/products/${entry.product.id}`
                                                                        )
                                                                    }>
                                                                    {t("productDetails")}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDeleteEntry(entry.id)
                                                                    }>
                                                                    {t("removeFromBasket")}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        handleUpdateQuantity(
                                                                            entry.id,
                                                                            entry.units,
                                                                            entry.product.unit
                                                                        );
                                                                    }}>
                                                                    {t("changeQuantity")}
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
                        <div className="flex w-full min-w-[500px] gap-3">
                            {basket?.basketEntries && (
                                <ProductsNutritionsChart basketEntries={basket.basketEntries} />
                            )}
                        </div>
                        <div className="flex w-full min-w-[500px] flex-wrap gap-3">
                            <CarbsChart nutritions={nutritions || []} />
                            <FatChart nutritions={nutritions || []} />
                        </div>
                        <RwsCard nutritions={nutritions!} />
                        <div className="min-w-[400px] flex-1 basis-0">
                            <NutrtitionsTable nutritions={nutritions || []} />
                        </div>
                        <div className="flex min-w-[500px] flex-1 basis-0 flex-col gap-3">
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
                                fiber={
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
                                    <p className="text-2xl">{t("allergens")}</p>
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
                                    {allergens?.length === 0 && (
                                        <p className="text-lg text-muted-foreground">
                                            {t("noAllergens")}
                                        </p>
                                    )}
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
