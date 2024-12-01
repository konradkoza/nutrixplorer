import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasketNutritions } from "@/types/BasketTypes";
import GradientBar from "./GradientBar";
import { rws, rwsM, rwsV } from "@/utils/rws";
import { GradientBarVariants } from "./GradientBarSmall";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type RwsCardProps = {
    nutritions: BasketNutritions[];
};

const RwsCard = ({ nutritions }: RwsCardProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>%RWS</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Wartości odżywcze</AccordionTrigger>
                        <AccordionContent>
                            {rws.map(
                                (rws) =>
                                    rws.value && (
                                        <div
                                            key={rws.group + rws.name + "rws"}
                                            className="items-center space-x-4">
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
                                                label={rws.name === "Total" ? rws.group : rws.name}
                                                variant={rws.variant as GradientBarVariants}
                                            />
                                        </div>
                                    )
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Witaminy</AccordionTrigger>
                        <AccordionContent>
                            {rwsV.map(
                                (rws) =>
                                    rws.value &&
                                    nutritions.find(
                                        (n) => n.groupName === rws.group && n.name === rws.name
                                    )?.quantity && (
                                        <div
                                            key={rws.group + rws.name + "rws"}
                                            className="items-center space-x-4">
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
                                                label={rws.name}
                                                variant={rws.variant as GradientBarVariants}
                                            />
                                        </div>
                                    )
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Minerały</AccordionTrigger>
                        <AccordionContent>
                            {rwsM.map(
                                (rws) =>
                                    rws.value &&
                                    nutritions.find(
                                        (n) => n.groupName === rws.group && n.name === rws.name
                                    )?.quantity && (
                                        <div
                                            key={rws.group + rws.name + "rws"}
                                            className="items-center space-x-4">
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
                                                label={rws.name}
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
