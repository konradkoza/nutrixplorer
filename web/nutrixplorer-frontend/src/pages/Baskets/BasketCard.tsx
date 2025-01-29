import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Basket, BasketFiltersFormType } from "@/types/BasketTypes";

import { Button } from "@/components/ui/button";
import { useGetBasketNutritionsQuery } from "@/redux/services/basketService";
import { DeepSet } from "@/utils/deepSet";
import { format } from "date-fns";
import { ArrowRightIcon, CopyIcon, ScaleIcon, Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { rws, rwsM, rwsV } from "@/utils/rws";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { add, remove } from "@/redux/slices/comparisonSlice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";
import { Mineral, SimpleNutritionalValue, Vitamin } from "@/types/NutritionalValueTypes";
import GradientBarSmallAdjusted, {
    GradientBarVariants,
} from "@/components/common/GradientBarSmallAdjusted.tsx";

type BasketCardProps = {
    basket: Basket;
    filters: BasketFiltersFormType;
    handleCloneBasket: (id: string, name: string) => void;
    handleDeleteBasket: (basketId: string) => void;
    showProducts?: boolean;
};

const filterToNutritionalValue = {
    minCarbs: { group: "Węglowodany", name: "Total" },
    minFat: { group: "Tłuszcz", name: "Total" },
    minProtein: { group: "Białko", name: "Białko" },
    minFiber: { group: "Błonnik", name: "Błonnik" },
    minEnergy: { group: "Wartość Energetyczna", name: "Wartość Energetyczna" },
    maxCarbs: { group: "Węglowodany", name: "Total" },
    maxFat: { group: "Tłuszcz", name: "Total" },
    maxProtein: { group: "Białko", name: "Białko" },
    maxFiber: { group: "Błonnik", name: "Błonnik" },
    maxEnergy: { group: "Wartość Energetyczna", name: "Wartość Energetyczna" },
    minSalt: { group: "Sól", name: "Sól" },
    maxSalt: { group: "Sól", name: "Sól" },
    minSaturatedFat: { group: "Tłuszcz", name: "Kwasy nasycone" },
    maxSaturatedFat: { group: "Tłuszcz", name: "Kwasy nasycone" },
    minSugars: { group: "Węglowodany", name: "Cukry" },
    maxSugars: { group: "Węglowodany", name: "Cukry" },
};

const BasketCard = ({
    basket,
    filters,
    handleCloneBasket,
    handleDeleteBasket,
    showProducts = false,
}: BasketCardProps) => {
    const navigate = useNavigate();
    const { data: nutritions, isLoading: isLoadingNutritions } = useGetBasketNutritionsQuery(
        basket.id
    );
    const filteredMinerals = new DeepSet<SimpleNutritionalValue>();
    const filteredVitamins = new DeepSet<SimpleNutritionalValue>();
    const filteredNutritions = new DeepSet<SimpleNutritionalValue>();
    const isFiltered = () => {
        return (
            filteredMinerals.size > 0 || filteredVitamins.size > 0 || filteredNutritions.size > 0
        );
    };
    const { baskets } = useSelector((state: RootState) => state.comparisonSlice);
    const dispatch = useDispatch();
    const [t, i18n] = useTranslation([
        TranslationNS.Baskets,
        TranslationNS.RWS,
        TranslationNS.NutritionalValues,
    ]);
    basket.basketEntries.forEach((entry) => {
        entry.product.nutritionalValues.forEach((nutrition) => {
            if (
                filters.minerals &&
                filters.minerals.includes(nutrition.nutritionalValueName.name as Mineral)
            ) {
                filteredMinerals.add({
                    group: nutrition.nutritionalValueName.group,
                    name: nutrition.nutritionalValueName.name,
                    unit: nutrition.unit,
                });
            }
            if (
                filters.vitamins &&
                filters.vitamins.includes(
                    nutrition.nutritionalValueName.name.split(" ")[1] as Vitamin
                )
            ) {
                filteredVitamins.add({
                    group: nutrition.nutritionalValueName.group,
                    name: nutrition.nutritionalValueName.name,
                    unit: nutrition.unit,
                });
            }
            Object.keys(filters).forEach((key) => {
                if (
                    key === "minerals" ||
                    key === "vitamins" ||
                    key === "allergens" ||
                    key === "name"
                )
                    return;
                // if (
                //     filterToNutritionalValue[key as keyof typeof filterToNutritionalValue].group ===
                //         nutrition.nutritionalValueName.group &&
                //     filterToNutritionalValue[key as keyof typeof filterToNutritionalValue].name ===
                //         nutrition.nutritionalValueName.name
                // ) {
                //     filteredNutritions.add({
                //         group: nutrition.nutritionalValueName.group,
                //         name: nutrition.nutritionalValueName.name,
                //         unit: nutrition.unit,
                //     });
                // }
                if (
                    filterToNutritionalValue[key as keyof typeof filterToNutritionalValue] ===
                    undefined
                )
                    return;
                filteredNutritions.add({
                    group: filterToNutritionalValue[key as keyof typeof filterToNutritionalValue]
                        .group,
                    name: filterToNutritionalValue[key as keyof typeof filterToNutritionalValue]
                        .name,
                    unit:
                        filterToNutritionalValue[key as keyof typeof filterToNutritionalValue]
                            .name === "Wartość Energetyczna"
                            ? "kcal"
                            : "g",
                });
            });
        });
    });

    const addToComparison = (basket: Basket): void => {
        if (baskets.some((bsk) => bsk.id === basket.id)) {
            dispatch(
                remove({
                    id: basket.id,
                    name: basket.name,
                })
            );
            return;
        } else if (baskets.length >= 2) {
            toast.error(t("errors.error"), {
                description: t("errors.max2"),
            });
            return;
        } else {
            dispatch(
                add({
                    id: basket.id,
                    name: basket.name,
                })
            );
        }
    };
    return (
        <Card className="flex w-full flex-col" key={basket.id}>
            <div className="flex justify-between">
                <CardHeader>
                    <CardTitle>{basket.name}</CardTitle>
                    <CardDescription>
                        {basket.description
                            ? basket.description?.length > 100
                                ? basket.description?.substring(0, 100) + "..."
                                : basket.description
                            : t("noDescription")}
                    </CardDescription>
                </CardHeader>
                <div className="flex flex-col justify-center pr-6 text-sm text-muted-foreground">
                    <p>{t("creationDate")}</p>
                    <p>
                        {i18n.language === "pl"
                            ? format(basket.createdAt, "dd.MM.yyyy H:mm")
                            : format(basket.createdAt, "dd/MM/yyyy H:mm")}{" "}
                    </p>
                </div>
            </div>

            <CardContent className="flex-grow">
                {nutritions && !isLoadingNutritions && isFiltered() && !showProducts && (
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("productName")}</TableHead>
                                    <TableHead>{t("quantityHeader")}</TableHead>
                                    <TableHead className="text-center">{t("rws")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMinerals.size > 0 &&
                                    Array.from(filteredMinerals).map((nutrition) => (
                                        <TableRow key={nutrition.name + nutrition.group}>
                                            <TableCell>
                                                {t(
                                                    rwsM.find(
                                                        (n) =>
                                                            n.name === nutrition.name &&
                                                            n.group === nutrition.group
                                                    )?.key || "",
                                                    { ns: TranslationNS.RWS }
                                                )}{" "}
                                            </TableCell>
                                            <TableCell className="text-nowrap">
                                                {nutritions
                                                    .find(
                                                        (n) =>
                                                            n.name === nutrition.name &&
                                                            n.groupName === nutrition.group
                                                    )
                                                    ?.quantity.toLocaleString(i18n.language, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 3,
                                                    })}{" "}
                                                {nutrition
                                                    ? nutrition.unit === "mcg"
                                                        ? "μg"
                                                        : nutrition.unit
                                                    : ""}
                                            </TableCell>
                                            <TableCell align="center">
                                                <GradientBarSmallAdjusted
                                                    max={
                                                        rwsM.find(
                                                            (n) =>
                                                                n.name === nutrition.name &&
                                                                n.group === nutrition.group
                                                        )?.value || 0
                                                    }
                                                    value={
                                                        nutritions.find(
                                                            (n) =>
                                                                n.name === nutrition.name &&
                                                                n.groupName === nutrition.group
                                                        )?.quantity || 0
                                                    }
                                                    variant="blueToGreen"
                                                    className="h-4 w-24"
                                                    unit={
                                                        rwsM.find(
                                                            (n) =>
                                                                n.name === nutrition.name &&
                                                                n.group === nutrition.group
                                                        )?.unit || ""
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {filteredVitamins.size > 0 &&
                                    Array.from(filteredVitamins).map((nutrition) => (
                                        <TableRow key={nutrition.name + nutrition.group}>
                                            <TableCell>
                                                {t(
                                                    rwsV.find(
                                                        (n) =>
                                                            n.name === nutrition.name &&
                                                            n.group === nutrition.group
                                                    )?.key || "",
                                                    { ns: TranslationNS.RWS }
                                                )}
                                            </TableCell>
                                            <TableCell className="text-nowrap">
                                                {nutritions
                                                    .find(
                                                        (n) =>
                                                            n.name === nutrition.name &&
                                                            n.groupName === nutrition.group
                                                    )
                                                    ?.quantity.toLocaleString(i18n.language, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 3,
                                                    })}{" "}
                                                {nutrition
                                                    ? nutrition.unit === "mcg"
                                                        ? "μg"
                                                        : nutrition.unit
                                                    : ""}
                                            </TableCell>
                                            <TableCell align="center">
                                                <GradientBarSmallAdjusted
                                                    max={
                                                        rwsV.find(
                                                            (n) =>
                                                                n.name === nutrition.name &&
                                                                n.group === nutrition.group
                                                        )?.value || 0
                                                    }
                                                    value={
                                                        nutritions.find(
                                                            (n) =>
                                                                n.name === nutrition.name &&
                                                                n.groupName === nutrition.group
                                                        )?.quantity || 0
                                                    }
                                                    variant="blueToGreen"
                                                    className="h-4 w-24"
                                                    unit={
                                                        rwsV.find(
                                                            (n) =>
                                                                n.name === nutrition.name &&
                                                                n.group === nutrition.group
                                                        )?.unit || ""
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {filteredNutritions.size > 0 &&
                                    Array.from(filteredNutritions).map((nutrition) => (
                                        <TableRow key={nutrition.name + nutrition.group}>
                                            <TableCell>
                                                {t(
                                                    nutrition.name === "Total"
                                                        ? nutrition.group
                                                        : nutrition.name,
                                                    { ns: TranslationNS.NutritionalValues }
                                                )}
                                                :{" "}
                                            </TableCell>
                                            <TableCell className="text-nowrap">
                                                {nutritions.find(
                                                    (n) =>
                                                        n.name === nutrition.name &&
                                                        n.groupName === nutrition.group
                                                )
                                                    ? nutritions
                                                          .find(
                                                              (n) =>
                                                                  n.name === nutrition.name &&
                                                                  n.groupName === nutrition.group
                                                          )!
                                                          .quantity.toLocaleString(i18n.language, {
                                                              minimumFractionDigits: 0,
                                                              maximumFractionDigits: 3,
                                                          })
                                                    : "0.00"}{" "}
                                                {nutrition.unit}
                                            </TableCell>
                                            <TableCell align="center">
                                                {rws.find(
                                                    (n) =>
                                                        n.name === nutrition.name &&
                                                        n.group === nutrition.group
                                                )?.variant ? (
                                                    <GradientBarSmallAdjusted
                                                        max={
                                                            rws.find(
                                                                (n) =>
                                                                    n.name === nutrition.name &&
                                                                    n.group === nutrition.group
                                                            )?.value || 0
                                                        }
                                                        value={
                                                            nutritions.find(
                                                                (n) =>
                                                                    n.name === nutrition.name &&
                                                                    n.groupName === nutrition.group
                                                            )?.quantity || 0
                                                        }
                                                        variant={
                                                            rws.find(
                                                                (n) =>
                                                                    n.name === nutrition.name &&
                                                                    n.group === nutrition.group
                                                            )?.variant as GradientBarVariants
                                                        }
                                                        className="h-4 w-24"
                                                        unit={
                                                            nutrition.name ===
                                                            "Wartość Energetyczna"
                                                                ? "kcal"
                                                                : "g"
                                                        }
                                                    />
                                                ) : (
                                                    <div className="w-24 text-center">-</div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                {basket.basketEntries.length > 0 ? (
                    !showProducts ? (
                        !isFiltered() && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("productName")}</TableHead>
                                        <TableHead>{t("quantityHeader")}</TableHead>
                                        <TableHead className="text-center">{t("rws")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rws.map((rw) => {
                                        const nutr = nutritions?.find(
                                            (n) => n.name === rw.name && n.groupName === rw.group
                                        ) || {
                                            name: rw.name,
                                            groupName: rw.group,
                                            quantity: 0,
                                            unit: rw.name === "Wartość Energetyczna" ? "kcal" : "g",
                                        };

                                        return (
                                            <TableRow
                                                key={nutr.name + nutr.groupName + "table"}
                                                className="hover:bg-inherit">
                                                <TableCell>
                                                    {t(rw.key, { ns: TranslationNS.RWS })}
                                                </TableCell>
                                                <TableCell className="text-nowrap">
                                                    {nutr.quantity.toLocaleString(i18n.language, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 3,
                                                    }) +
                                                        " " +
                                                        nutr.unit || ""}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {rw.value ? (
                                                        <GradientBarSmallAdjusted
                                                            max={rw.value}
                                                            value={nutr.quantity}
                                                            variant={
                                                                rw.variant as GradientBarVariants
                                                            }
                                                            className="h-4 w-24"
                                                            unit={
                                                                rw.name === "Wartość Energetyczna"
                                                                    ? "kcal"
                                                                    : "g"
                                                            }
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )
                    ) : (
                        <Table>
                            <TableBody>
                                {basket.basketEntries.map((entry) => (
                                    <TableRow key={entry.id} className="hover:bg-inherit">
                                        <TableCell>{entry.product.productName}</TableCell>
                                        <TableCell className="text-nowrap">
                                            {entry.units + " " + entry.product.unit || ""}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )
                ) : (
                    <p>{t("noProducts")}</p>
                )}
            </CardContent>
            <CardFooter className="flex flex-wrap">
                <Button
                    onClick={() => handleCloneBasket(basket.id, basket.name)}
                    variant="ghost"
                    className="gap-2">
                    <CopyIcon />
                    <p className="hidden">{t("duplicateBasket")}</p>
                </Button>
                <Button
                    className="gap-2"
                    variant="ghost"
                    onClick={() => handleDeleteBasket(basket.id)}>
                    <Trash2Icon />
                    <p className="hidden">{t("deleteBasket")}</p>
                </Button>
                <Button
                    className={cn(
                        "gap-2",
                        baskets.some((bsk) => bsk.id === basket.id) &&
                            "bg-red-200 hover:bg-red-300 dark:bg-red-400 dark:hover:bg-red-700"
                    )}
                    variant="ghost"
                    onClick={() => addToComparison(basket)}>
                    <ScaleIcon />
                    <p className="hidden">{t("addToComparison")}</p>
                </Button>
                <Button className="gap-2" variant="ghost" onClick={() => navigate(`${basket.id}`)}>
                    <p className="block">{t("details")}</p>
                    <ArrowRightIcon />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default BasketCard;
