import { useEffect, useState } from "react";
import { useGetMyFavouriteProductsPageQuery } from "@/redux/services/favouriteProductsService.ts";
import { getProductImage } from "@/utils/productUtils.ts";
import image from "@/assets/notFound.png";
import Spinner from "@/components/common/Spinner.tsx";
import ProductsList from "@/pages/Products/ProductsList.tsx";
import Pagination from "@/pages/Products/Pagination.tsx";

const FavouritesPage = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const { data: productPage, isLoading } = useGetMyFavouriteProductsPageQuery(
        {
            page: pageNumber,
            size: elements,
        }
    );
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
            {isLoading || loadingImages ? (
                <Spinner />
            ) : (
                productPage && (
                    <ProductsList
                        products={productPage.products}
                        setImageToDefault={setImageToDefault}
                        images={images}
                        favouriteProducts={productPage.products}
                    />
                )
            )}
            <div className="mt-5 flex w-full justify-center">
                {productPage &&
                    (productPage?.numberOfPages > 1 ||
                        productPage.products.length > 10) && (
                        <Pagination
                            pageNumber={pageNumber}
                            pageSize={elements}
                            setNumberOfElements={setElements}
                            setPageNumber={setPageNumber}
                            totalPages={productPage?.numberOfPages || 0}
                        />
                    )}
            </div>
            {!productPage ||
                (productPage.products.length === 0 && (
                    <div>Brak ulubionych produktów</div>
                ))}
        </div>
    );
};

export default FavouritesPage;
