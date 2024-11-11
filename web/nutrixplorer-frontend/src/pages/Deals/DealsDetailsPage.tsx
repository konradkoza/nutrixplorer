import imageAlt from "@/assets/notFound.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDealDetailsQuery } from "@/redux/services/DealService";
import { getProductImage } from "@/utils/productUtils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { FaHourglassEnd } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const DealDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [image, setImage] = useState<string>("");
    const { data: deal, isLoading } = useGetDealDetailsQuery(id!, {
        skip: !id,
    });
    const navigate = useNavigate();
    useEffect(() => {
        const fetchImage = async () => {
            const url = await getProductImage(deal?.product.id!);
            setImage(url);
        };

        if (deal) {
            fetchImage();
        }
        return () => {
            setImage("");
        };
    }, [deal]);

    if (!id) {
        return <div>Product ID is missing</div>;
    }
    console.log(deal);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex w-full justify-center">
            <div className="container flex flex-col gap-3">
                {deal && (
                    <div className="container flex flex-col gap-2">
                        <div className="flex w-full flex-col gap-2 sm:flex-row">
                            <Card className="flex items-center justify-center bg-white p-5 sm:w-1/3">
                                <img
                                    src={image}
                                    alt="Brak zdjęcia"
                                    className="max-h-80"
                                    onError={() => {
                                        setImage(imageAlt);
                                    }}
                                />
                            </Card>
                            <div className="flex flex-grow basis-0 flex-col sm:w-2/3">
                                <Card className="min-h-32">
                                    <CardHeader>
                                        <CardTitle>{deal.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xl text-primary">
                                                <span className="font-bold">
                                                    {deal.oldPrice} PLN{" "}
                                                </span>
                                                <span className="text-muted-foreground line-through">
                                                    {deal.newPrice} PLN
                                                </span>
                                                <span>
                                                    {" -"}
                                                    {Math.floor(
                                                        ((deal.oldPrice -
                                                            deal.newPrice) /
                                                            deal.oldPrice) *
                                                            100
                                                    )}
                                                    %
                                                </span>
                                            </p>
                                            <div className="">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger className="flex gap-1">
                                                            <FaHourglassEnd
                                                                size={20}
                                                            />
                                                            <span className="text-muted-foreground">
                                                                {" "}
                                                                {deal.endDate}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom">
                                                            <p className="text-foreground">
                                                                Koniec promocji
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                        <p>{deal.product.productName}</p>
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/products/${deal.product.id}`
                                                )
                                            }
                                            className="mt-5"
                                            variant="outline">
                                            Szczegóły produktu
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <Card className="min-h-32">
                            <CardHeader>
                                <CardTitle>Opis okazji</CardTitle>
                            </CardHeader>
                            <CardContent>{deal.description}</CardContent>
                        </Card>
                        {/* seller and shop info */}
                        <Card className="min-h-32">
                            <CardHeader>
                                <CardTitle>Sprzedawca</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{deal.seller.address.shopName} </p>
                                <p>
                                    {deal.seller.address.zip}{" "}
                                    {deal.seller.address.city}, ul.{" "}
                                    {deal.seller.address.street}{" "}
                                    {deal.seller.address.number}
                                </p>
                                <p>{deal.seller.user.email}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};
export default DealDetailsPage;
