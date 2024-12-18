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
    const [t] = useTranslation(TranslationNS.Products);
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
                                {element.displayName ? element.displayName : element.name}
                            </TableCell>
                            <TableCell>
                                {nutrition ? nutrition.quantity.toFixed(2) : 0}{" "}
                                {nutrition ? nutrition.unit : ""}
                            </TableCell>
                            <TableCell>
                                {nutrition
                                    ? (
                                          (nutrition.quantity / 100) *
                                          portion.portionQuantity
                                      ).toFixed(2)
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
                            <TableCell>{nutrition.nutritionalValueName.name}</TableCell>
                            <TableCell>
                                {nutrition ? nutrition.quantity.toFixed(2) : 0}{" "}
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
                                      ).toFixed(2)
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
