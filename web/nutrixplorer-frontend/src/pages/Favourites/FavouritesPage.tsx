import Spinner from "@/components/common/Spinner.tsx";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import Pagination from "@/pages/Products/Pagination.tsx";
import ProductsList from "@/pages/Products/ProductsList.tsx";
import { useGetMyFavouriteProductsPageQuery } from "@/redux/services/favouriteProductsService.ts";
import { TranslationNS } from "@/types/TranslationNamespaces";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FavouritesPage = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const { data: productPage, isLoading } = useGetMyFavouriteProductsPageQuery({
        page: pageNumber,
        size: elements,
    });
    const [t] = useTranslation(TranslationNS.Favourites);
    const breadcrumbs = useBreadcrumbs([
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.favourites"), path: "/favourites" },
    ]);

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="container">{breadcrumbs}</div>
            {isLoading ? (
                <Spinner />
            ) : (
                productPage && (
                    <ProductsList
                        products={productPage.products}
                        favouriteProducts={productPage.products}
                    />
                )
            )}
            <div className="mt-5 flex w-full justify-center">
                {productPage &&
                    (productPage?.numberOfPages > 1 || productPage.products.length > 10) && (
                        <Pagination
                            pageNumber={pageNumber}
                            pageSize={elements}
                            setNumberOfElements={setElements}
                            setPageNumber={setPageNumber}
                            totalPages={productPage?.numberOfPages || 0}
                        />
                    )}
            </div>
            {!productPage || (productPage.products.length === 0 && <div>{t("noFavourites")}</div>)}
        </div>
    );
};

export default FavouritesPage;
