import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasketNutritions } from "@/types/BasketTypes";
import GradientBar from "../../components/common/GradientBar";
import { rws, rwsM, rwsV } from "@/utils/rws";
import { GradientBarVariants } from "../../components/common/GradientBarSmall";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";

type RwsCardProps = {
    nutritions: BasketNutritions[];
};

const RwsCard = ({ nutritions }: RwsCardProps) => {
    const [t] = useTranslation([TranslationNS.Baskets, TranslationNS.RWS]);
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("rws")}</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>{t("nutritionalValues")}</AccordionTrigger>
                        <AccordionContent>
                            {rws.map(
                                (rws) =>
                                    rws.value && (
                                        <div
                                            key={rws.group + rws.name + "rws"}
                                            className="items-center">
                                            <GradientBar
                                                value={
                                                    nutritions.find(
                                                        (n) =>
                                                            n.groupName === rws.group &&
                                                            n.name === rws.name
                                                    )?.quantity || 0
                                                }
                                                barHeight="h-4"
                                                height="h-8"
                                                unit={
                                                    rws.name === "Wartość Energetyczna"
                                                        ? "kcal"
                                                        : "g"
                                                }
                                                max={rws.value!}
                                                label={t(rws.key, { ns: TranslationNS.RWS })}
                                                variant={rws.variant as GradientBarVariants}
                                            />
                                        </div>
                                    )
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>{t("vitamins")}</AccordionTrigger>
                        <AccordionContent>
                            {rwsV.map(
                                (rws) =>
                                    rws.value &&
                                    nutritions.find(
                                        (n) => n.groupName === rws.group && n.name === rws.name
                                    )?.quantity && (
                                        <div
                                            key={rws.group + rws.name + "rws"}
                                            className="items-center">
                                            <GradientBar
                                                value={
                                                    nutritions.find(
                                                        (n) =>
                                                            n.groupName === rws.group &&
                                                            n.name === rws.name
                                                    )?.quantity || 0
                                                }
                                                barHeight="h-4"
                                                height="h-8"
                                                unit={rws.unit}
                                                max={rws.value!}
                                                label={t(rws.key, { ns: TranslationNS.RWS })}
                                                variant={rws.variant as GradientBarVariants}
                                            />
                                        </div>
                                    )
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>{t("minerals")}</AccordionTrigger>
                        <AccordionContent>
                            {rwsM.map(
                                (rws) =>
                                    rws.value &&
                                    nutritions.find(
                                        (n) => n.groupName === rws.group && n.name === rws.name
                                    )?.quantity && (
                                        <div
                                            key={rws.group + rws.name + "rws"}
                                            className="items-center">
                                            <GradientBar
                                                value={
                                                    nutritions.find(
                                                        (n) =>
                                                            n.groupName === rws.group &&
                                                            n.name === rws.name
                                                    )?.quantity || 0
                                                }
                                                barHeight="h-4"
                                                height="h-8"
                                                unit={rws.unit}
                                                max={rws.value!}
                                                label={t(rws.key, { ns: TranslationNS.RWS })}
                                                variant={rws.variant as GradientBarVariants}
                                            />
                                        </div>
                                    )
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default RwsCard;
