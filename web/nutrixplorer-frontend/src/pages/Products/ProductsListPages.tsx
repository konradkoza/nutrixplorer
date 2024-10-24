import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardImage,
} from "@/components/ui/card";
import { useGetProductPageQuery } from "@/redux/services/productService";
import { getProductImage } from "@/utils/productUtils";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import image from "@/assets/notFound.png";
import Spinner from "@/components/common/Spinner";
const ProductsListPages = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const { data: productPage, isLoading } = useGetProductPageQuery({
        page: pageNumber,
        elements: elements,
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
    }, [productPage]);

    return (
        <div className="flex flex-col items-center justify-center">
            {isLoading || loadingImages ? (
                <Spinner />
            ) : (
                <div className="container grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
                    {productPage?.products.map((product, index) => (
                        <Card
                            key={product.id}
                            className="min-w-52 flex-shrink-0 flex-grow-0 hover:bg-secondary/95">
                            <div className="flex justify-center">
                                <CardImage
                                    src={images[index]}
                                    alt="Brak zdjęcia"
                                    className="h-52 w-auto"
                                    onError={() => {
                                        setImages((prev) => {
                                            const newImages = [...prev];
                                            newImages[index] = image;
                                            return newImages;
                                        });
                                    }}
                                />
                            </div>
                            <CardHeader>
                                <h2>{product.productName}</h2>
                            </CardHeader>
                            <CardContent className="max-h-full">
                                <p>{product.productDescription}</p>
                            </CardContent>
                            <CardFooter>
                                {product.productQuantity}{" "}
                                {product.unit ? product.unit.name : ""}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            <div className="mt-5 flex w-full justify-center">
                {productPage && productPage?.numberOfPages > 1 && (
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
