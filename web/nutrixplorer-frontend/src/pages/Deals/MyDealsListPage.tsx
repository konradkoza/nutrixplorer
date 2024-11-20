import image from "@/assets/notFound.png";
import Spinner from "@/components/common/Spinner";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import { useGetMyDealsQuery } from "@/redux/services/dealService";
import { getProductImage } from "@/utils/productUtils";
import { useEffect, useState } from "react";
import Pagination from "../Products/Pagination";
import MyDealsList from "./MyDealsList";

const MyDealsListPage = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const { data: dealsPage, isLoading } = useGetMyDealsQuery({
        page: pageNumber,
        elements: elements,
    });
    const [images, setImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState<boolean>(false);
    const breadcrumbs = useBreadcrumbs([
        { title: "NutriXplorer", path: "/" },
        { title: "Moje okazje", path: "/my-deals" },
    ]);
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
            <div className="container flex flex-col gap-2">
                {breadcrumbs}
                {isLoading || loadingImages ? (
                    <Spinner />
                ) : (
                    dealsPage !== undefined && (
                        <MyDealsList
                            deals={dealsPage.deals}
                            images={images}
                            setImageToDefault={setImageToDefault}
                        />
                    )
                )}

                <div className="mt-5 flex w-full justify-center">
                    {dealsPage && (dealsPage?.numberOfPages > 1 || dealsPage.deals.length > 10) && (
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
