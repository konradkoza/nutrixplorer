import Indicator from "@/components/common/Indicator";
import Spinner from "@/components/common/Spinner";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import {
    useGetFilteredBasketsListQuery,
    useLazyGetBasketAllergensQuery,
    useLazyGetBasketDetailsQuery,
    useLazyGetBasketNutritionsQuery,
} from "@/redux/services/basketService";
import { Basket, BasketNutritions } from "@/types/BasketTypes";
import { DeepSet } from "@/utils/deepSet";
import { calculateMax } from "@/utils/maxValue";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import ComparisonCarbsChart from "./ComparisonCarbsChart";
import ComparisonFatChart from "./ComparisonFatChart";
import ComparisonNutritionChart from "./ComparisonNutritionChart";
import ComparisonRadarChart from "./ComparisonRadarChart";
import IndexComparisonChart from "./IndexComparisonChart";
import ProductsStackedBarChart from "./ProductsStackedBarChart";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";
import { simpleNutritionTable } from "@/constants/NutritionConstants";
import { cn } from "@/lib/utils";
import AutocompleteSelect from "@/components/common/AutocompleteSelect";
import ComparisonRwsCard from "./ComparisonRwsCard";

type NutritionSet = {
    name: string;
    groupName: string;
};

const defaultNutritionSet: NutritionSet[] = [
    {
        name: "Wartość Energetyczna",
        groupName: "Wartość Energetyczna",
    },
    {
        name: "Total",
        groupName: "Tłuszcz",
    },
    {
        name: "Kwasy nasycone",
        groupName: "Tłuszcz",
    },
    {
        name: "Total",
        groupName: "Węglowodany",
    },
    {
        name: "Cukry",
        groupName: "Węglowodany",
    },
    { name: "Białko", groupName: "Białko" },
    { name: "Błonnik", groupName: "Błonnik" },
    { name: "Sól", groupName: "Sól" },
];

const BasketComparisonPage = () => {
    const [t, i18n] = useTranslation([
        TranslationNS.Comparison,
        TranslationNS.Allergens,
        TranslationNS.NutritionalValues,
    ]);
    const [urlParams, setUrlParams] = useSearchParams();
    const [searchValue1, setSearchValue1] = useState<string>("");
    const [value1] = useDebounce(searchValue1, 100);
    const [searchValue2, setSearchValue2] = useState<string>("");
    const [value2] = useDebounce(searchValue2, 100);
    const { data: basketList1, isLoading: isLoading1 } = useGetFilteredBasketsListQuery(value1);
    const { data: basketList2, isLoading: isLoading2 } = useGetFilteredBasketsListQuery(value2);
    const [basket1, setBasket1] = useState<string | null>(null);
    const [basket2, setBasket2] = useState<string | null>(null);
    const [showComparison, setShowComparison] = useState<boolean>(false);
    const [basketDetails, setBasketDetails] = useState<Basket[]>([]);
    const [basketNutritions, setBasketNutritions] = useState<BasketNutritions[][]>([]);
    const [basketAllergens, setBasketAllergens] = useState<string[][]>([]);
    const [getBasketDetails] = useLazyGetBasketDetailsQuery();
    const [getBasketNutritions] = useLazyGetBasketNutritionsQuery();
    const [getBasketALlergens] = useLazyGetBasketAllergensQuery();
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const [nutritionSet, setNutritionSet] = useState<DeepSet<NutritionSet>>(
        new DeepSet(defaultNutritionSet)
    );
    const breadcrumbs = useBreadcrumbs([
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.comparison"), path: "/compare" },
    ]);

    useEffect(() => {
        if (urlParams.get("compare1") !== undefined && urlParams.get("compare2") !== undefined) {
            fetchBasketsData(true);
            setShowComparison(true);
        }
    }, []);

    const fetchBasketsData = async (params: boolean) => {
        setFetchingData(true);
        const b1 = params ? urlParams.get("compare1") : basket1;
        const b2 = params ? urlParams.get("compare2") : basket2;
        if (b1 && b2) {
            try {
                const [response1, response2, nutritions1, nutritions2, allergens1, allergens2] =
                    await Promise.all([
                        getBasketDetails(b1).unwrap(),
                        getBasketDetails(b2).unwrap(),
                        getBasketNutritions(b1).unwrap(),
                        getBasketNutritions(b2).unwrap(),
                        getBasketALlergens(b1).unwrap(),
                        getBasketALlergens(b2).unwrap(),
                    ]);
                setBasketDetails([response1, response2]);
                const newSet = new DeepSet<NutritionSet>(defaultNutritionSet);
                nutritions1.forEach((element) => {
                    newSet.add({ name: element.name, groupName: element.groupName });
                });
                nutritions2.forEach((element) => {
                    newSet.add({ name: element.name, groupName: element.groupName });
                });
                setNutritionSet(newSet);
                setBasketNutritions([nutritions1, nutritions2]);
                setBasketAllergens([allergens1, allergens2]);
            } catch (error) {
                console.error("Error fetching basket data:", error);
            }
        }
        setFetchingData(false);
    };

    return (
        <div className="flex w-full justify-center">
            <div className="container flex w-full flex-col gap-3">
                {breadcrumbs}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-3xl">{t("comparisonTitle")}</CardTitle>
                        <p>{t("description")}</p>
                    </CardHeader>
                    <CardContent className="flex justify-evenly">
                        {/* <AutoComplete
                            selectedValue={basket1 || ""}
                            onSelectedValueChange={setBasket1}
                            searchValue={searchValue1}
                            onSearchValueChange={setSearchValue1}
                            items={
                                basketList1
                                    ? basketList1.map((basket) => {
                                          return {
                                              value: basket.id,
                                              label: basket.name,
                                          };
                                      })
                                    : []
                            }
                            isLoading={isLoading1}
                            emptyMessage={t("noBaskets")}
                            placeholder={t("search")}
                        /> */}
                        <div className="w-1/3">
                            <AutocompleteSelect
                                selectedValue={basket1 || ""}
                                setSelectedValue={setBasket1}
                                searchValue={searchValue1}
                                setSearchValue={setSearchValue1}
                                suggestions={
                                    basketList1
                                        ? basketList1.map((basket) => {
                                              return {
                                                  value: basket.id,
                                                  label: basket.name,
                                              };
                                          })
                                        : []
                                }
                                emptyMessage={t("noBaskets")}
                                label={t("basket1")}
                                placeholder={t("search")}
                                isLoading={isLoading1}
                            />
                        </div>
                        <div className="w-1/3">
                            <AutocompleteSelect
                                selectedValue={basket2 || ""}
                                setSelectedValue={setBasket2}
                                searchValue={searchValue2}
                                setSearchValue={setSearchValue2}
                                suggestions={
                                    basketList2
                                        ? basketList2.map((basket) => {
                                              return {
                                                  value: basket.id,
                                                  label: basket.name,
                                              };
                                          })
                                        : []
                                }
                                emptyMessage={t("noBaskets")}
                                label={t("basket2")}
                                placeholder={t("search")}
                                isLoading={isLoading2}
                            />
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-center">
                        <Button
                            onClick={() => {
                                setShowComparison(true);
                                if (
                                    urlParams.get("compare1") !== null &&
                                    urlParams.get("compare2") !== null
                                ) {
                                    setUrlParams({});
                                }
                                fetchBasketsData(false);
                            }}
                            disabled={!basket1 || !basket2}>
                            {t("compare")}
                        </Button>
                    </CardContent>
                    {fetchingData && <Spinner />}
                    {basketDetails.length > 0 && showComparison && !fetchingData && (
                        <div className="flex flex-col justify-center">
                            <CardContent className="w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-2/12"></TableHead>
                                            <TableHead className="w-5/12">
                                                <Button asChild variant="link">
                                                    <Link
                                                        to={`/baskets/${basket1 || basketDetails[0].id}`}>
                                                        {t("basket1")} (
                                                        {basketDetails[0]
                                                            ? basketDetails[0].name
                                                            : ""}
                                                        )
                                                    </Link>
                                                </Button>
                                            </TableHead>
                                            <TableHead className="w-5/12">
                                                <Button asChild variant="link">
                                                    <Link
                                                        to={`/baskets/${basket2 || basketDetails[1].id}`}>
                                                        {t("basket2")} (
                                                        {basketDetails[1]
                                                            ? basketDetails[1].name
                                                            : ""}
                                                        )
                                                    </Link>
                                                </Button>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                </Table>
                            </CardContent>
                            <div>
                                <p className="text-center text-xl">
                                    {t("nutritionalValuesComparison")}
                                </p>
                                <div className="flex w-full flex-wrap">
                                    <div className="flex flex-1 flex-col">
                                        <ComparisonRadarChart nutritions={basketNutritions} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-center text-xl">{t("indexComparison")}</p>
                                <div className="flex w-full flex-wrap">
                                    <div className="flex flex-1 flex-col">
                                        <IndexComparisonChart baskets={basketDetails} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-center text-xl">{t("fatComparison")}</p>
                                <div className="flex w-full flex-wrap">
                                    {basketNutritions.map((nutritions, index) => (
                                        <div
                                            key={index + "nutritionChart"}
                                            className="flex flex-1 flex-col">
                                            <p className="w-full p-2 text-center">
                                                {t("basket")} {index + 1}
                                            </p>
                                            <ComparisonFatChart nutritions={nutritions} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-center text-xl">{t("carbsComparison")}</p>
                                <div className="flex w-full flex-wrap">
                                    {basketNutritions.map((nutritions, index) => (
                                        <div
                                            key={index + "nutritionChart"}
                                            className="flex flex-1 flex-col">
                                            <p className="w-full p-2 text-center">
                                                {t("basket")} {index + 1}
                                            </p>
                                            <ComparisonCarbsChart nutritions={nutritions} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-center text-xl">
                                    {t("nutritionalValuesInEnergy")}
                                </p>
                                <div className="flex w-full flex-wrap">
                                    {basketNutritions.map((nutritions, index) => (
                                        <div
                                            key={index + "nutritionChart"}
                                            className="flex flex-1 flex-col">
                                            <p className="w-full p-2 text-center">
                                                {t("basket")} {index + 1}
                                            </p>
                                            <ComparisonNutritionChart
                                                carbs={
                                                    nutritions?.find(
                                                        (nutr) =>
                                                            nutr.groupName === "Węglowodany" &&
                                                            nutr.name === "Total"
                                                    )?.quantity || 0
                                                }
                                                fat={
                                                    nutritions?.find(
                                                        (nutr) =>
                                                            nutr.groupName === "Tłuszcz" &&
                                                            nutr.name === "Total"
                                                    )?.quantity || 0
                                                }
                                                protein={
                                                    nutritions?.find(
                                                        (nutr) => nutr.name === "Białko"
                                                    )?.quantity || 0
                                                }
                                                fiber={
                                                    nutritions?.find(
                                                        (nutr) => nutr.name === "Błonnik"
                                                    )?.quantity || 0
                                                }
                                                poliole={
                                                    nutritions?.find(
                                                        (nutr) => nutr.name === "Poliole"
                                                    )?.quantity || undefined
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="">
                                <p className="text-center text-xl">
                                    {t("nutritionalValuesInProducts")}
                                </p>
                                <div className="flex flex-1 flex-wrap">
                                    {basketDetails.map((basket, index) => (
                                        <div
                                            key={basket.id + "nutritionChart"}
                                            className="flex flex-1 flex-col">
                                            <p className="w-full p-2 text-center">
                                                {t("basket")} {index + 1}
                                            </p>
                                            <ProductsStackedBarChart
                                                key={basket.id + "stackedBarChart"}
                                                basketEntries={basket.basketEntries}
                                                maxNutritionalValue={(() => {
                                                    return calculateMax(
                                                        basketDetails.map(
                                                            (basket) => basket.basketEntries
                                                        )
                                                    );
                                                })()}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <ComparisonRwsCard basketNutritions={basketNutritions} />
                            <p className="my-2 text-center text-xl">
                                {t("otherInformationComparison")}
                            </p>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableHead>{t("numberOfElements")}</TableHead>
                                            {basketDetails.map((basket) => (
                                                <TableCell
                                                    className="w-5/12"
                                                    key={basket.id + "elements"}>
                                                    {basket.basketEntries.length}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>{t("allergens")}</TableHead>
                                            {basketAllergens.map((allergenList, index) => (
                                                <TableCell
                                                    className={cn(
                                                        allergenList.length > 0
                                                            ? "text-red-500"
                                                            : "text-green-500",
                                                        "w-5/12"
                                                    )}
                                                    key={index + "allergens"}>
                                                    {allergenList.length > 0
                                                        ? allergenList.map((allergen) => (
                                                              <p key={allergen}>
                                                                  {t(allergen, {
                                                                      ns: TranslationNS.Allergens,
                                                                  })}
                                                              </p>
                                                          ))
                                                        : t("noAllergens")}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>{t("productsInBasket")}</TableHead>
                                            {basketDetails.map((basket, index) => {
                                                return (
                                                    <TableCell
                                                        key={index + "products"}
                                                        className="w-5/12">
                                                        {basket.basketEntries.map((entry) => (
                                                            <p key={entry.id}>
                                                                {entry.product.productName} -{" "}
                                                                {entry.units} {entry.product.unit}
                                                            </p>
                                                        ))}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>{t("summaryFFIndex")}</TableHead>
                                            {basketDetails.map((basket, index) => {
                                                const indexes = basket.basketEntries.map(
                                                    (entry) => entry.productIndexes
                                                );
                                                const sum = indexes.reduce((acc, curr) => {
                                                    return (
                                                        acc +
                                                        (curr.find(
                                                            (element) => element.indexName === "T"
                                                        )?.indexValue || 0)
                                                    );
                                                }, 0);

                                                return (
                                                    <TableCell
                                                        className="w-5/12"
                                                        key={index + "ff"}>
                                                        {sum}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>{t("summarySUMIndex")}</TableHead>
                                            {basketDetails.map((basket, index) => {
                                                const indexes = basket.basketEntries.map(
                                                    (entry) => entry.productIndexes
                                                );
                                                const sum = indexes.reduce((acc, curr) => {
                                                    return (
                                                        acc +
                                                        (curr.find(
                                                            (element) => element.indexName === "S"
                                                        )?.indexValue || 0)
                                                    );
                                                }, 0);

                                                return (
                                                    <TableCell
                                                        className="w-5/12"
                                                        key={index + "sum"}>
                                                        {sum}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Accordion
                                    type="single"
                                    collapsible
                                    defaultValue="item-1"
                                    className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            {t("nutritionalValues")}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <Table>
                                                <TableBody>
                                                    {Array.from(nutritionSet).map((set) => (
                                                        <TableRow key={set.name + set.groupName}>
                                                            <TableHead className="w-2/12">
                                                                {t(
                                                                    set.name === "Total"
                                                                        ? set.groupName
                                                                        : set.name.trim(),
                                                                    {
                                                                        ns: TranslationNS.NutritionalValues,
                                                                    }
                                                                )}
                                                            </TableHead>
                                                            {basketNutritions.map(
                                                                (basketNutrition, index) => {
                                                                    const nutritionValue =
                                                                        basketNutrition.find(
                                                                            (element) =>
                                                                                element.name ===
                                                                                    set.name &&
                                                                                element.groupName ===
                                                                                    set.groupName
                                                                        );
                                                                    return (
                                                                        <TableCell
                                                                            className="w-5/12"
                                                                            key={
                                                                                index +
                                                                                "nutritionalValues"
                                                                            }>
                                                                            <div className="flex items-center gap-1">
                                                                                {nutritionValue?.name !==
                                                                                    "Wartość Energetyczna" && (
                                                                                    <Indicator
                                                                                        variant={(() => {
                                                                                            const nutr =
                                                                                                simpleNutritionTable.find(
                                                                                                    (
                                                                                                        n
                                                                                                    ) =>
                                                                                                        n.name ===
                                                                                                            nutritionValue?.name &&
                                                                                                        n.group ===
                                                                                                            nutritionValue.groupName
                                                                                                );
                                                                                            if (
                                                                                                (nutritionValue
                                                                                                    ? Number(
                                                                                                          nutritionValue.quantity
                                                                                                      )
                                                                                                    : 0) >
                                                                                                0
                                                                                            ) {
                                                                                                return (
                                                                                                    nutr?.variantConsists ||
                                                                                                    "green"
                                                                                                );
                                                                                            }
                                                                                            return (
                                                                                                nutr?.variantNotConsists ||
                                                                                                "red"
                                                                                            );
                                                                                        })()}
                                                                                    />
                                                                                )}
                                                                                {nutritionValue?.quantity.toLocaleString(
                                                                                    i18n.language,
                                                                                    {
                                                                                        minimumFractionDigits: 0,
                                                                                        maximumFractionDigits: 3,
                                                                                    }
                                                                                ) || 0}{" "}
                                                                                {nutritionValue?.unit ===
                                                                                "mcg"
                                                                                    ? "μg"
                                                                                    : nutritionValue?.unit ||
                                                                                      ""}
                                                                            </div>
                                                                        </TableCell>
                                                                    );
                                                                }
                                                            )}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default BasketComparisonPage;
