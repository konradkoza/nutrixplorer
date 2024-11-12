import { useGetMyDealsQuery } from "@/redux/services/dealService";
import { getProductImage } from "@/utils/productUtils";
import { useEffect, useState } from "react";
import image from "@/assets/notFound.png";
import Pagination from "../Products/Pagination";
import DealsList from "./DealsList";
import Spinner from "@/components/common/Spinner";

const MyDealsListPage = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const { data: dealsPage, isLoading } = useGetMyDealsQuery({
        page: pageNumber,
        elements: elements,
    });
    const [images, setImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState<boolean>(false);

    useEffect(() => {
        setImages([]);
        const fetchImages = async () => {
            if (dealsPage) {
                setLoadingImages(true);
                const imagePromises = dealsPage.deals.map((deal) =>
                    getProductImage(deal.product.id)
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
    }, [dealsPage]);

    const setImageToDefault = (index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = image;
            return newImages;
        });
    };

    return (
        <div className="flex w-full justify-center">
            <div className="container flex flex-col gap-3">
                <p className="font-semi-bold mt-5 text-3xl">Moje okazje</p>
                {isLoading || loadingImages ? (
                    <Spinner />
                ) : (
                    dealsPage !== undefined && (
                        <DealsList
                            deals={dealsPage.deals}
                            images={images}
                            setImageToDefault={setImageToDefault}
                        />
                    )
                )}

                <div className="mt-5 flex w-full justify-center">
                    {dealsPage &&
                        (dealsPage?.numberOfPages > 1 ||
                            dealsPage.deals.length > 10) && (
                            <Pagination
                                pageNumber={pageNumber}
                                pageSize={elements}
                                setNumberOfElements={setElements}
                                setPageNumber={setPageNumber}
                                totalPages={dealsPage?.numberOfPages || 0}
                            />
                        )}
                </div>
            </div>
        </div>
    );
};

export default MyDealsListPage;
