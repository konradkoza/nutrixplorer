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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    useGetUserBasketsListQuery,
    useLazyGetBasketAllergensQuery,
    useLazyGetBasketDetailsQuery,
    useLazyGetBasketNutritionsQuery,
} from "@/redux/services/basketService";
import { Basket, BasketNutritions } from "@/types/BasketTypes";
import { DeepSet } from "@/utils/deepSet";
import { productIndexesNames } from "@/utils/productUtils";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EnergyValueComparison from "./EnergyValueComparison";

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
    const { data: basketOptions, isLoading } = useGetUserBasketsListQuery();
    const [basket1, setBasket1] = useState<string | null>(null);
    const [basket2, setBasket2] = useState<string | null>(null);
    const [showComparison, setShowComparison] = useState<boolean>(false);
    const [basketDetails, setBasketDetails] = useState<Basket[]>([]);
    const [basketNutritions, setBasketNutritions] = useState<BasketNutritions[][]>([]);
    const [basketAllergens, setBasketAllergens] = useState<string[][]>([]);
    const [getBasketDetails, getBasketDetailsState] = useLazyGetBasketDetailsQuery();
    const [getBasketNutritions, getBasketNutritionsState] = useLazyGetBasketNutritionsQuery();
    const [getBasketALlergens, getBasketALlergensState] = useLazyGetBasketAllergensQuery();
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const [nutritionSet, setNutritionSet] = useState<DeepSet<NutritionSet>>(
        new DeepSet(defaultNutritionSet)
    );

    const fetchBasketsData = async () => {
        setFetchingData(true);
        if (basket1 && basket2) {
            try {
                const [response1, response2, nutritions1, nutritions2, allergens1, allergens2] =
                    await Promise.all([
                        getBasketDetails(basket1).unwrap(),
                        getBasketDetails(basket2).unwrap(),
                        getBasketNutritions(basket1).unwrap(),
                        getBasketNutritions(basket2).unwrap(),
                        getBasketALlergens(basket1).unwrap(),
                        getBasketALlergens(basket2).unwrap(),
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
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-3xl">Porównanie koszyków</CardTitle>
                        <p>Wybierz koszyki do porównania</p>
                    </CardHeader>
                    <CardContent className="flex justify-evenly">
                        <Select
                            defaultValue={basket1 || ""}
                            onValueChange={(val) => {
                                setBasket1(val);
                            }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Wybierz koszyk 1" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Koszyki</SelectLabel>
                                    {!isLoading &&
                                        basketOptions?.map((basket) => (
                                            <SelectItem key={basket.id} value={basket.id}>
                                                {basket.name}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select
                            defaultValue={basket2 || ""}
                            onValueChange={(val) => {
                                setBasket2(val);
                            }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Wybierz koszyk 2" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Koszyki</SelectLabel>
                                    {!isLoading &&
                                        basketOptions?.map((basket) => (
                                            <SelectItem key={basket.id} value={basket.id}>
                                                {basket.name}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </CardContent>
                    <CardContent className="flex justify-center">
                        <Button
                            onClick={() => {
                                setShowComparison(true);
                                fetchBasketsData();
                            }}
                            disabled={!basket1 || !basket2}>
                            Porównaj
                        </Button>
                    </CardContent>
                    {fetchingData && <Spinner />}
                    {showComparison && !fetchingData && (
                        <div className="flex justify-center">
                            <CardContent className="w-3/4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-2/12"></TableHead>
                                            <TableHead className="w-5/12">
                                                <Button asChild variant="link">
                                                    <Link to={`/baskets/${basket1}`}>Koszyk 1</Link>
                                                </Button>
                                            </TableHead>
                                            <TableHead className="w-5/12">
                                                <Button asChild variant="link">
                                                    <Link to={`/baskets/${basket2}`}>Koszyk 2</Link>
                                                </Button>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableHead>Liczba elementów</TableHead>
                                            {basketDetails.map((basket) => (
                                                <TableCell key={basket.id}>
                                                    {basket.basketEntries.length}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Alergeny</TableHead>
                                            {basketAllergens.map((allergenList, index) => (
                                                <TableCell key={index}>
                                                    {allergenList.map((allergen) => (
                                                        <p key={allergen}>{allergen}</p>
                                                    ))}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Produkty w koszyku</TableHead>
                                            {basketDetails.map((basket, index) => {
                                                return (
                                                    <TableCell key={index}>
                                                        {basket.basketEntries.map((entry) => (
                                                            <p>
                                                                {entry.product.productName} -{" "}
                                                                {entry.units} {entry.product.unit}
                                                            </p>
                                                        ))}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Sumaryczny indeks FF</TableHead>
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

                                                return <TableCell key={index}>{sum}</TableCell>;
                                            })}
                                        </TableRow>
                                        <TableRow>
                                            <TableHead>Sumaryczny indeks SUM</TableHead>
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

                                                return <TableCell key={index}>{sum}</TableCell>;
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
                                        <AccordionTrigger>Wartości odżywcze</AccordionTrigger>
                                        <AccordionContent>
                                            <Table>
                                                <TableBody>
                                                    {Array.from(nutritionSet).map((set) => (
                                                        <TableRow key={set.name}>
                                                            <TableHead className="w-2/12">
                                                                {set.name === "Total"
                                                                    ? set.groupName
                                                                    : set.name}
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
                                                                            key={index}>
                                                                            {Number(
                                                                                nutritionValue?.quantity.toFixed(
                                                                                    3
                                                                                )
                                                                            ) || 0}{" "}
                                                                            {nutritionValue?.unit ||
                                                                                ""}
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
                                <Accordion
                                    type="single"
                                    collapsible
                                    defaultValue="item-1"
                                    className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            Wartości odżywcze (% Wartości Energetycznej)
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <EnergyValueComparison
                                                energyValues={basketNutritions.map((nutritions) => {
                                                    return {
                                                        carbs:
                                                            nutritions?.find(
                                                                (nutr) =>
                                                                    nutr.groupName ===
                                                                        "Węglowodany" &&
                                                                    nutr.name === "Total"
                                                            )?.quantity || 0,

                                                        fat:
                                                            nutritions?.find(
                                                                (nutr) =>
                                                                    nutr.groupName === "Tłuszcz" &&
                                                                    nutr.name === "Total"
                                                            )?.quantity || 0,

                                                        protein:
                                                            nutritions?.find(
                                                                (nutr) => nutr.name === "Białko"
                                                            )?.quantity || 0,

                                                        fibre:
                                                            nutritions?.find(
                                                                (nutr) => nutr.name === "Błonnik"
                                                            )?.quantity || 0,
                                                    };
                                                })}
                                            />
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
