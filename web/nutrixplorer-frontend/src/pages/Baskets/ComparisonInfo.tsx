import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { clear, remove } from "@/redux/slices/comparisonSlice";
import { SimpleBasket } from "@/types/BasketTypes";
import { CheckCheckIcon, EraserIcon, ScaleIcon, XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";

type ComparisonInfoProps = {
    baskets: SimpleBasket[];
};

const ComparisonInfo = ({ baskets }: ComparisonInfoProps) => {
    const { t } = useTranslation(TranslationNS.Baskets);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleRemoveBasket = (basket: SimpleBasket) => {
        // remove(basket);
        console.log("basket removed");
        dispatch(remove({ id: basket.id, name: basket.name }));
    };

    const handleClear = () => {
        dispatch(clear());
    };

    const handleComapare = () => {
        dispatch(clear());
        navigate(`/compare?compare1=${baskets[0].id}&compare2=${baskets[1].id}`);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="fixed right-5 top-20 z-30 flex items-center gap-2 rounded-xl bg-card/50">
                    <Button variant="outline" className="flex items-center gap-2">
                        <ScaleIcon className="h-7 w-7" />
                        <p className="text-xl">{baskets.length}/2</p>
                    </Button>
                </div>
            </PopoverTrigger>

            <PopoverContent className="mr-5">
                <div className="flex flex-col">
                    <p className="mb-2 w-full font-semibold">{t("comparisonBaskets")}</p>
                    {baskets.map((basket) => (
                        <div className="grid w-full grid-cols-2 items-center" key={basket.id}>
                            <p>{basket.name}</p>
                            <Button
                                onClick={() => handleRemoveBasket(basket)}
                                variant="ghost"
                                className="w-fit place-self-end p-2">
                                <XIcon />
                            </Button>
                            <Separator className="col-span-2" />
                        </div>
                    ))}
                </div>
                <div className="mt-2 flex justify-center gap-2">
                    <Button onClick={handleClear} className="gap-2" variant="ghost">
                        <EraserIcon /> {t("clear")}
                    </Button>
                    <Button onClick={handleComapare} className="gap-2" variant="ghost">
                        <CheckCheckIcon /> {t("compare")}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ComparisonInfo;
