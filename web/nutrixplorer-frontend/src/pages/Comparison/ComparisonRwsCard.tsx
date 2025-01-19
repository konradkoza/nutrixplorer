import GradientBarAdjusted from "@/components/common/GradientBarAdjusted.tsx";
import { GradientBarVariants } from "@/components/common/GradientBarSmallAdjusted";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BasketNutritions } from "@/types/BasketTypes";
import { rws, rwsM, rwsV } from "@/utils/rws";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

type ComparisonRwsCardProps = {
    basketNutritions: BasketNutritions[][];
};

const ComparisonRwsCard = ({ basketNutritions }: ComparisonRwsCardProps) => {
    const [t] = useTranslation([
        TranslationNS.Baskets,
        TranslationNS.RWS,
        TranslationNS.Comparison,
    ]);

    const renderNutritionBars = (
        nutritions1: BasketNutritions[],
        nutritions2: BasketNutritions[],
        rwsData: any[]
    ) => {
        return rwsData.map((rws) => {
            const value1 =
                nutritions1.find((n) => n.groupName === rws.group && n.name === rws.name)
                    ?.quantity || 0;
            const value2 =
                nutritions2.find((n) => n.groupName === rws.group && n.name === rws.name)
                    ?.quantity || 0;
            if ((value1 === 0 && value2 === 0) || rws.name === "Błonnik") return null;
            return (
                <div key={rws.group + rws.name + "rws"} className="items-center">
                    <GradientBarAdjusted
                        value={value1}
                        barHeight="h-4"
                        height="h-8"
                        unit={rws.name === "Wartość Energetyczna" ? "kcal" : "g"}
                        max={rws.value!}
                        label={t(rws.key, { ns: TranslationNS.RWS })}
                        variant={rws.variant as GradientBarVariants}
                    />
                </div>
            );
        });
    };

    return (
        <div className="w-full p-6">
            <p className="text-center text-xl">
                {t("comparisonRws", { ns: TranslationNS.Comparison })}
            </p>
            <Accordion type="multiple">
                <AccordionItem value="item-1">
                    <AccordionTrigger>{t("nutritionalValues")}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1">
                                <p className="text-center text-base font-semibold">
                                    {t("basket1", { ns: TranslationNS.Comparison })}
                                </p>
                                {renderNutritionBars(basketNutritions[0], basketNutritions[1], rws)}
                            </div>
                            <div className="mt-4 flex-1 md:mt-0">
                                <p className="text-center text-base font-semibold">
                                    {t("basket2", { ns: TranslationNS.Comparison })}
                                </p>
                                {renderNutritionBars(basketNutritions[1], basketNutritions[0], rws)}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>{t("vitamins")}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1">
                                <p className="text-center text-base font-semibold">
                                    {t("basket1", { ns: TranslationNS.Comparison })}
                                </p>
                                {renderNutritionBars(
                                    basketNutritions[0],
                                    basketNutritions[1],
                                    rwsV
                                )}
                            </div>
                            <div className="mt-4 flex-1 md:mt-0">
                                <p className="text-center text-base font-semibold">
                                    {t("basket2", { ns: TranslationNS.Comparison })}
                                </p>
                                {renderNutritionBars(
                                    basketNutritions[1],
                                    basketNutritions[0],
                                    rwsV
                                )}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>{t("minerals")}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1">
                                <p className="text-center text-base font-semibold">
                                    {t("basket1", { ns: TranslationNS.Comparison })}
                                </p>
                                {renderNutritionBars(
                                    basketNutritions[0],
                                    basketNutritions[1],
                                    rwsM
                                )}
                            </div>
                            <div className="mt-4 flex-1 md:mt-0">
                                <p className="text-center text-base font-semibold">
                                    {t("basket2", { ns: TranslationNS.Comparison })}
                                </p>
                                {renderNutritionBars(
                                    basketNutritions[1],
                                    basketNutritions[0],
                                    rwsM
                                )}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ComparisonRwsCard;
