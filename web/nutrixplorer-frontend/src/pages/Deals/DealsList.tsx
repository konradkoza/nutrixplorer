import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardImage,
    CardTitle,
} from "@/components/ui/card";
import { SimpleDeal } from "@/types/DealTypes";
import { CiLocationOn, CiShop } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

type DealsListProps = {
    deals: SimpleDeal[];
    images: string[];
    setImageToDefault: (index: number) => void;
};

const DealsList = ({ images, deals, setImageToDefault }: DealsListProps) => {
    const navigate = useNavigate();

    return (
        <>
            {deals?.map((deal, index) => (
                <Card
                    key={deal.id}
                    className="flex justify-between hover:bg-secondary/95"
                    onClick={() => navigate(`/deals/${deal.id}`)}>
                    <div className="flex h-full flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {deal.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex h-full flex-col">
                            <div>
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
                                            ((deal.oldPrice - deal.newPrice) /
                                                deal.oldPrice) *
                                                100
                                        )}
                                        %
                                    </span>
                                </p>
                            </div>
                            <p className="text-sm">
                                {deal.description.length > 100
                                    ? deal.description.substring(0, 100) + "..."
                                    : deal.description}
                            </p>
                        </CardContent>
                        <CardFooter className="justify-self-end">
                            <div>
                                <div className="mt-5 flex text-sm">
                                    <CiShop size={20} />
                                    <span>{deal.seller.shopName}</span>
                                </div>
                                <div className="flex text-sm">
                                    <CiLocationOn size={20} />
                                    <span>{deal.seller.city}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </div>
                    <div className="flex w-40 min-w-40 basis-auto items-center justify-center bg-white p-2 sm:min-w-80">
                        <CardImage
                            src={images[index]}
                            alt="Brak zdjęcia"
                            className="h-auto max-h-40 w-auto max-w-40 sm:max-h-80 sm:max-w-80"
                            onError={() => setImageToDefault(index)}
                        />
                    </div>
                </Card>
            ))}
        </>
    );
};

export default DealsList;
