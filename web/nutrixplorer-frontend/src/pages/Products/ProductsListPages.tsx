import Spinner from "@/components/common/Spinner";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import FilteringComponent, { FilteringFormType } from "@/pages/Products/FilteringComponent.tsx";
import ProductsList from "@/pages/Products/ProductsList.tsx";
import { useGetMyFavouriteProductsQuery } from "@/redux/services/favouriteProductsService.ts";
import { useGetProductFilteredPageQuery } from "@/redux/services/productService";
import { RootState } from "@/redux/store";
import { AccessLevel } from "@/types/UserTypes";
import { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "./Pagination";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

const ProductsListPages = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(8);
    const [filters, setFilters] = useState<FilteringFormType>();
    const [t] = useTranslation(TranslationNS.Products);
    const {
        data: productPage,
        isFetching,
        refetch,
    } = useGetProductFilteredPageQuery({
        page: pageNumber,
        elements: elements,
        ...(filters || ({} as FilteringFormType)),
    });
    const { accessLevels } = useSelector((state: RootState) => state.authSlice);
    const { data: favouriteProducts } = useGetMyFavouriteProductsQuery(undefined, {
        skip: !accessLevels.includes(AccessLevel.CLIENT),
    });

    const breadcrumbs = useBreadcrumbs([
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.products"), path: "/products" },
    ]);
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="container">{breadcrumbs}</div>
            <FilteringComponent setFilters={setFilters} refetch={refetch} />
            {isFetching ? (
                <Spinner />
            ) : (
                productPage && (
                    <>
                        <ProductsList
                            products={productPage.products}
                            favouriteProducts={favouriteProducts}
                            addToBasket={accessLevels.includes(AccessLevel.CLIENT)}
                        />
                    </>
                )
            )}
            <div className="mt-5 flex w-full justify-center">
                {productPage &&
                    (productPage?.numberOfPages > 1 || productPage.products.length > 8) && (
                        <Pagination
                            pageNumber={pageNumber}
                            pageSize={elements}
                            setNumberOfElements={setElements}
                            setPageNumber={setPageNumber}
                            totalPages={productPage?.numberOfPages || 0}
                            elements={[8, 16, 24]}
                        />
                    )}
            </div>
        </div>
    );
};

export default ProductsListPages;
