import ConfirmationAlertDialog from "@/components/common/ConfirmationAlertDialog";
import Spinner from "@/components/common/Spinner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import {
    useDeleteBasketMutation,
    useGetFilteredBasketsQuery,
} from "@/redux/services/basketService";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../Products/Pagination";
import AddBasketDialog from "./AddBasketDialog";
import BasketCard from "./BasketCard";
import BasketFilters from "./BasketsFilters";
import CloneBasketDialog from "./CloneBasketDialog";
import ComparisonInfo from "./ComparisonInfo";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";
import { BasketFiltersFormType } from "@/types/BasketTypes";

const BasketsListPage = () => {
    const { t } = useTranslation(TranslationNS.Baskets);
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(9);
    const [filters, setFilters] = useState<BasketFiltersFormType>({} as BasketFiltersFormType);
    // @ts-ignore
    const [sorting, setSorting] = useState<"asc" | "desc">("desc");
    const { data: basketsPage, isLoading: isBasketsPageLoading } = useGetFilteredBasketsQuery({
        page: pageNumber,
        elements: elements,
        sorting: sorting,
        ...(filters || ({} as BasketFiltersFormType)),
    });
    const navigate = useNavigate();
    const breadcrumbs = useBreadcrumbs([
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.baskets"), path: "/baskets" },
    ]);
    const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
    const [basketId, setBasketId] = useState<string>("");
    const [currentName, setCurrentName] = useState<string>("");
    const [deleteBasket] = useDeleteBasketMutation();
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [basketToDelete, setBasketToDelete] = useState("");
    const [showProducts, setShowProducts] = useState(false);
    const { baskets } = useSelector((state: RootState) => state.comparisonSlice);
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
            <div className="relative flex flex-col items-center gap-2">
                {baskets.length > 0 && (
                    <ComparisonInfo
                        baskets={baskets.map((basket) => {
                            return {
                                id: basket.id,
                                name: basket.name,
                            };
                        })}
                    />
                )}
                <div className="container flex items-center justify-between">
                    {breadcrumbs}
                    <AddBasketDialog />
                </div>
                {isBasketsPageLoading ? (
                    <Spinner />
                ) : (
                    <div className="container flex h-full w-full flex-col items-stretch gap-5 md:flex-row md:flex-wrap xl:flex-row xl:flex-wrap">
                        <BasketFilters setFilters={setFilters} />
                        <div className="flex w-full justify-end">
                            {/* <Button
                                variant="ghost"
                                onClick={() => setSorting(sorting === "asc" ? "desc" : "asc")}>
                                {sorting === "asc" ? (
                                    <ArrowUpNarrowWideIcon />
                                ) : (
                                    <ArrowDownNarrowWideIcon />
                                )}
                            </Button> */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="products-list"
                                    checked={showProducts}
                                    onCheckedChange={setShowProducts}
                                />
                                <Label htmlFor="products-list" aria-disabled>
                                    {t("showProducts")}
                                </Label>
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
                                <p className="w-full text-center">{t("noBaskets")}</p>
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
                                        elements={[9, 15, 21]}
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
                    content={t("deleteConfirmationContent")}
                    title={t("deleteConfirmationTitle")}
                    confirmContent={t("deleteConfirmationButton")}
                    trigger={false}
                />
            </div>
        </>
    );
};

export default BasketsListPage;
