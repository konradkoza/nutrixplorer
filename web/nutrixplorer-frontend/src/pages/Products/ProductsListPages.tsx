import image from "@/assets/notFound.png";
import Spinner from "@/components/common/Spinner";
import ProductsList from "@/pages/Products/ProductsList.tsx";
import { useGetMyFavouriteProductsQuery } from "@/redux/services/favouriteProductsService.ts";
import { useGetProductFilteredPageQuery } from "@/redux/services/productService";
import { RootState } from "@/redux/store";
import { AccessLevel } from "@/types/UserTypes";
import { getProductImage } from "@/utils/productUtils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "./Pagination";
import FilteringComponent, { FilteringFormType } from "@/pages/Products/FilteringComponent.tsx";

const ProductsListPages = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const [filters, setFilters] = useState<FilteringFormType>();
    const { data: productPage, isLoading } = useGetProductFilteredPageQuery({
        page: pageNumber,
        elements: elements,
        ...(filters || ({} as FilteringFormType)),
    });
    const { accessLevels } = useSelector((state: RootState) => state.authSlice);
    const { data: favouriteProducts } = useGetMyFavouriteProductsQuery(undefined, {
        skip: !accessLevels.includes(AccessLevel.CLIENT),
    });
    const [images, setImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState<boolean>(false);

    useEffect(() => {
        setImages([]);
        const fetchImages = async () => {
            if (productPage) {
                setLoadingImages(true);
                const imagePromises = productPage.products.map((product) =>
                    getProductImage(product.id)
                );
                const imageUrls = await Promise.all(imagePromises);
                setImages(imageUrls);
                setLoadingImages(false);
            }
        };
        fetchImages();
        return () => {
            setImages([]);
        };
    }, [productPage]);

    const setImageToDefault = (index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = image;
            return newImages;
        });
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <FilteringComponent setFilters={setFilters} />
            {isLoading || loadingImages ? (
                <Spinner />
            ) : (
                productPage && (
                    <ProductsList
                        products={productPage.products}
                        setImageToDefault={setImageToDefault}
                        images={images}
                        favouriteProducts={favouriteProducts}
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
        </div>
    );
};

export default ProductsListPages;
