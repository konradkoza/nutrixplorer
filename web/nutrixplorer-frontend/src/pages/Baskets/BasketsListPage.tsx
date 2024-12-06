import ConfirmationAlertDialog from "@/components/common/ConfirmationAlertDialog";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import {
    useDeleteBasketMutation,
    useGetFilteredBasketsQuery,
} from "@/redux/services/basketService";
import { ArrowDownNarrowWideIcon, ArrowUpNarrowWideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../Products/Pagination";
import AddBasketDialog from "./AddBasketDialog";
import BasketCard from "./BasketCard";
import BasketFilters, { BasketFiltersFormType } from "./BasketsFilters";
import CloneBasketDialog from "./CloneBasketDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const BasketsListPage = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const [filters, setFilters] = useState<BasketFiltersFormType>({} as BasketFiltersFormType);
    const [sorting, setSorting] = useState<"asc" | "desc">("desc");
    const { data: basketsPage, isLoading: isBasketsPageLoading } = useGetFilteredBasketsQuery({
        page: pageNumber,
        elements: elements,
        sorting: sorting,
        ...(filters || ({} as BasketFiltersFormType)),
    });
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
    const [showProducts, setShowProducts] = useState(false);

    const hadleDeleteBasket = (id: string) => {
        deleteBasket(id);
        setConfirmationOpen(!confirmationOpen);
        navigate("/baskets");
    };

    const handleCloneBasket = (basketId: string, basketName: string) => {
        setBasketId(basketId);
        setCurrentName(basketName);
        setCloneDialogOpen(true);
    };

    const handleDeleteBasket = (basketId: string) => {
        setBasketToDelete(basketId);
        setConfirmationOpen(true);
    };

    return (
        <>
            <div className="flex flex-col items-center gap-2">
                <div className="container flex items-center justify-between">
                    {breadcrumbs}
                    <AddBasketDialog />
                </div>
                {isBasketsPageLoading ? (
                    <Spinner />
                ) : (
                    <div className="container flex h-full w-full flex-col items-stretch gap-5 md:flex-row md:flex-wrap xl:flex-row xl:flex-wrap">
                        <BasketFilters setFilters={setFilters} />
                        <div className="flex w-full justify-between">
                            <Button
                                variant="ghost"
                                onClick={() => setSorting(sorting === "asc" ? "desc" : "asc")}>
                                {sorting === "asc" ? (
                                    <ArrowUpNarrowWideIcon />
                                ) : (
                                    <ArrowDownNarrowWideIcon />
                                )}
                            </Button>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="products-list"
                                    checked={showProducts}
                                    onCheckedChange={setShowProducts}
                                />
                                <Label htmlFor="products-list">Pokaż produkty</Label>
                            </div>
                        </div>
                        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(25rem,1fr))]">
                            {basketsPage && basketsPage.baskets?.length > 0 ? (
                                basketsPage.baskets?.map((basket) => (
                                    <BasketCard
                                        key={basket.id}
                                        basket={basket}
                                        filters={filters}
                                        handleCloneBasket={handleCloneBasket}
                                        handleDeleteBasket={handleDeleteBasket}
                                        showProducts={showProducts}
                                    />
                                ))
                            ) : (
                                <p className="w-full text-center">Brak koszyków.</p>
                            )}
                        </div>
                        <div className="mt-5 flex w-full justify-center">
                            {basketsPage &&
                                (basketsPage?.numberOfPages > 1 ||
                                    basketsPage.baskets.length > 10) && (
                                    <Pagination
                                        pageNumber={pageNumber}
                                        pageSize={elements}
                                        setNumberOfElements={setElements}
                                        setPageNumber={setPageNumber}
                                        totalPages={basketsPage?.numberOfPages || 0}
                                    />
                                )}
                        </div>
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
