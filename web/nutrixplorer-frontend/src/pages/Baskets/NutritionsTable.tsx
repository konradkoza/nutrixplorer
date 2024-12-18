import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BasketNutritions } from "@/types/BasketTypes";
import Indicator from "../../components/common/Indicator";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";
import { simpleNutritionTable } from "@/constants/NutritionConstants";

type NutritionsTableProps = {
    nutritions: BasketNutritions[];
};

const NutrtitionsTable = ({ nutritions }: NutritionsTableProps) => {
    const [t] = useTranslation(TranslationNS.Baskets);
    return (
        <Card className="h-full">
            <CardHeader>
                <p className="text-2xl">{t("summaryNutrValue")}</p>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead align="left" className="w-8"></TableHead>
                            <TableHead align="left">{t("nutrValue")}</TableHead>
                            <TableHead>{t("totalValue")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {simpleNutritionTable.map((element) => {
                            const nutrition = nutritions.find(
                                (nutrition) =>
                                    nutrition.name === element.name &&
                                    nutrition.groupName === element.group
                            );
                            return (
                                <TableRow key={element.name + element.group}>
                                    <TableCell align="left">
                                        {element.name !== "Wartość Energetyczna" && (
                                            <Indicator
                                                variant={(() => {
                                                    const nutr = simpleNutritionTable.find(
                                                        (n) =>
                                                            n.name === element.name &&
                                                            n.group === element.group
                                                    );
                                                    if (
                                                        (nutrition
                                                            ? Number(nutrition.quantity)
                                                            : 0) > 0
                                                    ) {
                                                        return nutr?.variantConsists || "green";
                                                    }
                                                    return nutr?.variantNotConsists || "green";
                                                })()}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {element.displayName ? element.displayName : element.name}
                                    </TableCell>
                                    <TableCell>
                                        {nutrition ? Number(nutrition.quantity.toFixed(2)) : 0}{" "}
                                        {nutrition ? nutrition.unit : ""}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {nutritions
                            .filter((nutr) => {
                                return !simpleNutritionTable.some((simpleElement) => {
                                    return nutr.name === simpleElement.name;
                                });
                            })
                            .map((nutrition) => (
                                <TableRow key={nutrition.name + nutrition.groupName}>
                                    <TableCell align="left">
                                        <Indicator
                                            variant={
                                                simpleNutritionTable.find(
                                                    (n) =>
                                                        n.name === nutrition.name &&
                                                        n.group === nutrition.groupName
                                                )?.variantConsists || "green"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{nutrition.name}</TableCell>
                                    <TableCell>
                                        {nutrition ? Number(nutrition.quantity.toFixed(2)) : 0}{" "}
                                        {nutrition
                                            ? nutrition.unit === "mcg"
                                                ? "μg"
                                                : nutrition.unit
                                            : ""}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default NutrtitionsTable;
