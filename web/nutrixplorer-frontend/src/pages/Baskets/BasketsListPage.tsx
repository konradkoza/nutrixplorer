import ConfirmationAlertDialog from "@/components/common/ConfirmationAlertDialog";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import { useDeleteBasketMutation, useGetMyBasketsQuery } from "@/redux/services/basketService";
import { format } from "date-fns";
import { ArrowRightIcon, CopyIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBasketDialog from "./AddBasketDialog";
import CloneBasketDialog from "./CloneBasketDialog";

const BasketsListPage = () => {
    const { data: baskets, isLoading } = useGetMyBasketsQuery();
    const navigate = useNavigate();
    const breadcrumbs = useBreadcrumbs([
        { title: "NutriXplorer", path: "/" },
        { title: "Koszyki", path: "/baskets" },
    ]);
    const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
    const [basketId, setBasketId] = useState<string>("");
    const [currentName, setCurrentName] = useState<string>("");
    const [deleteBasket] = useDeleteBasketMutation();
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [basketToDelete, setBasketToDelete] = useState("");
    const hadleDeleteBasket = (id: string) => {
        deleteBasket(id);
        setConfirmationOpen(!confirmationOpen);
        navigate("/baskets");
    };

    return (
        <>
            <div className="flex flex-col items-center gap-2">
                <div className="container flex items-center justify-between">
                    {breadcrumbs}
                    <AddBasketDialog />
                </div>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="container flex h-full w-full flex-col items-stretch gap-5 xl:flex-row xl:flex-wrap">
                        {baskets && baskets?.length > 0 ? (
                            baskets?.map((basket) => (
                                <Card
                                    className="flex w-full flex-col md:w-full xl:w-[calc(50%-1rem)]"
                                    key={basket.id}>
                                    <div className="flex justify-between">
                                        <CardHeader>
                                            <CardTitle>{basket.name}</CardTitle>
                                            <CardDescription>{basket.description}</CardDescription>
                                        </CardHeader>
                                        <div className="flex flex-col justify-center pr-6 text-sm text-muted-foreground">
                                            <p>{"Data utworzenia: "}</p>
                                            <p>{format(basket.createdAt, "dd.MM.yyyy H:mm")} </p>
                                        </div>
                                    </div>

                                    <CardContent className="flex-grow">
                                        {basket.basketEntries.length > 0 ? (
                                            <Table>
                                                <TableBody>
                                                    {basket.basketEntries.map((entry) => (
                                                        <TableRow
                                                            key={entry.id}
                                                            className="hover:bg-inherit">
                                                            <TableCell>
                                                                {entry.product.productName}
                                                            </TableCell>
                                                            <TableCell className="text-nowrap">
                                                                {entry.units +
                                                                    " " +
                                                                    entry.product.unit || ""}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <p>Brak produktów w koszyku .</p>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex">
                                        <Button
                                            onClick={() => {
                                                setBasketId(basket.id);
                                                setCurrentName(basket.name);
                                                setCloneDialogOpen(true);
                                            }}
                                            variant="ghost"
                                            className="gap-2">
                                            <CopyIcon />
                                            <p className="hidden md:block">Duplikuj koszyk</p>
                                        </Button>
                                        <Button
                                            className="gap-2"
                                            variant="ghost"
                                            onClick={() => {
                                                setBasketToDelete(basket.id);
                                                setConfirmationOpen(true);
                                            }}>
                                            <Trash2Icon />
                                            <p className="hidden md:block">Usuń koszyk</p>
                                        </Button>
                                        <Button
                                            className="gap-2"
                                            variant="ghost"
                                            onClick={() => navigate(`${basket.id}`)}>
                                            <p className="hidden md:block">Szczegóły</p>
                                            <ArrowRightIcon />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <p className="w-full text-center">Brak koszyków.</p>
                        )}
                    </div>
                )}
                <CloneBasketDialog
                    basketId={basketId}
                    currentName={currentName}
                    onClose={() => setCloneDialogOpen(false)}
                    open={cloneDialogOpen}
                />
                <ConfirmationAlertDialog
                    open={confirmationOpen}
                    setOpen={() => setConfirmationOpen(!confirmationOpen)}
                    onConfirm={() => hadleDeleteBasket(basketToDelete)}
                    content="Czy na pewno chcesz usunąć ten koszyk?"
                    title="Czy jesteś pewny"
                    confirmContent="Usuń"
                />
            </div>
        </>
    );
};

export default BasketsListPage;
