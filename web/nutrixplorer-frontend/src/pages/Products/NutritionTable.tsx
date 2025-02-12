import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { simpleNutritionTable } from "@/constants/NutritionConstants";
import { NutritionalValue, Portion } from "@/types/ProductTypes";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

type NutritionTableProps = {
    nutritions: NutritionalValue[];
    portion: Portion;
};

const NutritionTable = ({ nutritions, portion }: NutritionTableProps) => {
    const [t, i18n] = useTranslation([TranslationNS.Products, TranslationNS.NutritionalValues]);
    return (
        <Table className="mt-4">
            <TableHeader className="w-full">
                <TableRow>
                    <TableHead className=""> {t("nutritionalValue")} </TableHead>
                    <TableHead>100 {portion.unit}</TableHead>
                    <TableHead>
                        {t("portion")} ({portion.portionQuantity} {portion.unit})
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {simpleNutritionTable.map((element) => {
                    const nutrition = nutritions.find(
                        (nutrition) =>
                            nutrition.nutritionalValueName.name === element.name &&
                            nutrition.nutritionalValueName.group === element.group
                    );
                    return (
                        <TableRow key={element.name + element.group}>
                            <TableCell>
                                {t(element.displayName ? element.displayName : element.name, {
                                    ns: TranslationNS.NutritionalValues,
                                })}
                            </TableCell>
                            <TableCell>
                                {nutrition
                                    ? nutrition.quantity.toLocaleString(i18n.language, {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                      })
                                    : 0}{" "}
                                {nutrition ? nutrition.unit : ""}
                            </TableCell>
                            <TableCell>
                                {nutrition
                                    ? (
                                          (nutrition.quantity / 100) *
                                          portion.portionQuantity
                                      ).toLocaleString(i18n.language, {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                      })
                                    : 0}{" "}
                                {nutrition ? nutrition.unit : ""}
                            </TableCell>
                        </TableRow>
                    );
                })}
                {nutritions
                    .filter((nutr) => {
                        return !simpleNutritionTable.some((simpleElement) => {
                            return nutr.nutritionalValueName.name === simpleElement.name;
                        });
                    })
                    .map((nutrition) => (
                        <TableRow
                            key={
                                nutrition.nutritionalValueName.name +
                                nutrition.nutritionalValueName.group
                            }>
                            <TableCell>
                                {t(nutrition.nutritionalValueName.name, {
                                    ns: TranslationNS.NutritionalValues,
                                })}
                            </TableCell>
                            <TableCell>
                                {nutrition
                                    ? nutrition.quantity.toLocaleString(i18n.language, {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                      })
                                    : 0}{" "}
                                {nutrition
                                    ? nutrition.unit === "mcg"
                                        ? "μg"
                                        : nutrition.unit
                                    : ""}
                            </TableCell>
                            <TableCell>
                                {nutrition
                                    ? (
                                          (nutrition.quantity / 100) *
                                          portion.portionQuantity
                                      ).toLocaleString(i18n.language, {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                      })
                                    : 0}{" "}
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
    );
};

export default NutritionTable;
