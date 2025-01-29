import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasketNutritions } from "@/types/BasketTypes";
import { rws, rwsM, rwsV } from "@/utils/rws";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";
import GradientBarAdjusted from "@/components/common/GradientBarAdjusted.tsx";
import { GradientBarVariants } from "@/components/common/GradientBarSmallAdjusted";

type RwsCardProps = {
    nutritions: BasketNutritions[];
};

const RwsCard = ({ nutritions }: RwsCardProps) => {
    const [t] = useTranslation([TranslationNS.Baskets, TranslationNS.RWS]);

    const renderNutritionBars = (nutritions: BasketNutritions[], rwsData: any[]) => {
        return rwsData.map((rws) => {
            const value =
                nutritions.find((n) => n.groupName === rws.group && n.name === rws.name)
                    ?.quantity || 0;
            if (value === 0 || rws.name === "Błonnik") return null;
            return (
                <div key={rws.group + rws.name + "rws"} className="items-center">
                    <GradientBarAdjusted
                        value={value}
                        barHeight="h-4"
                        height="h-8"
                        unit={rws.unit}
                        max={rws.value!}
                        label={t(rws.key, { ns: TranslationNS.RWS })}
                        variant={rws.variant as GradientBarVariants}
                    />
                </div>
            );
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("rws")}</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>{t("nutritionalValues")}</AccordionTrigger>
                        <AccordionContent>{renderNutritionBars(nutritions, rws)}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>{t("vitamins")}</AccordionTrigger>
                        <AccordionContent>{renderNutritionBars(nutritions, rwsV)}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>{t("minerals")}</AccordionTrigger>
                        <AccordionContent>{renderNutritionBars(nutritions, rwsM)}</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default RwsCard;
