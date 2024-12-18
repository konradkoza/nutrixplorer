import AutocompleteTextInput from "@/components/common/AutocompleteTextInput";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { mineralsNames, vitaminsNames } from "@/constants/NutritionConstants";
import { useGetFilteredBasketsListQuery } from "@/redux/services/basketService";
import { useGetAllergensQuery } from "@/redux/services/productService";
import { BasketFiltersFormType } from "@/types/BasketTypes";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

const minMaxFields = [
    { min: "minCarbs", max: "maxCarbs", label: "carbs" },
    { min: "minFat", max: "maxFat", label: "fat" },
    { min: "minProtein", max: "maxProtein", label: "protein" },
    { min: "minFiber", max: "maxFiber", label: "fiber" },
    { min: "minEnergy", max: "maxEnergy", label: "energyValue" },
    { min: "minSalt", max: "maxSalt", label: "salt" },
    { min: "minSugar", max: "maxSugar", label: "sugar" },
    { min: "minSaturatedFat", max: "maxSaturatedFat", label: "saturatedFat" },
] satisfies { min: keyof BasketFiltersFormType; max: keyof BasketFiltersFormType; label: string }[];

type BasketFiltersProps = {
    setFilters: (data: any) => void;
};

const BasketFilters = ({ setFilters }: BasketFiltersProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [value] = useDebounce(searchValue, 100);
    const { data: basketList, isLoading } = useGetFilteredBasketsListQuery(value);
    const { t } = useTranslation(TranslationNS.Baskets);
    const { data: allergens, isLoading: isAllergensLoading } = useGetAllergensQuery();
    const form = useForm<BasketFiltersFormType>({
        values: {
            name: "",
            minCarbs: "",
            maxCarbs: "",
            minFat: "",
            maxFat: "",
            minProtein: "",
            maxProtein: "",
            minFiber: "",
            maxFiber: "",
            minEnergy: "",
            maxEnergy: "",
            minSalt: "",
            maxSalt: "",
            minSugar: "",
            maxSugar: "",
            minSaturatedFat: "",
            maxSaturatedFat: "",
            vitamins: [],
            minerals: [],
            allergens: [],
        },
        resetOptions: {
            keepDefaultValues: true,
        },
    });

    const onSubmit = (data: BasketFiltersFormType) => {
        const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== "" && value !== undefined) {
                (acc as any)[key] = value;
            }
            return acc;
        }, {} as BasketFiltersFormType);
        setFilters(filteredData);
    };

    return (
        <div className="container w-full">
            <Accordion type="single" collapsible className="w-full bg-muted/90 px-5">
                <AccordionItem value="item-1">
                    <AccordionTrigger>{t("filters")}</AccordionTrigger>
                    <AccordionContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="m-2 flex flex-col gap-5">
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormControl>
                                                    <AutocompleteTextInput
                                                        searchValue={field.value || ""}
                                                        setSearchValue={(e) => {
                                                            field.onChange(e);
                                                            setSearchValue(e);
                                                        }}
                                                        suggestions={
                                                            basketList?.map(
                                                                (basket) => basket.name
                                                            ) || []
                                                        }
                                                        isLoading={isLoading}
                                                        emptyMessage={t("noBaskets")}
                                                        label={t("basketName")}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] flex-wrap gap-5">
                                    {minMaxFields.map(({ min, max, label }) => (
                                        <div
                                            key={label}
                                            className="flex max-w-[480px] flex-grow flex-col gap-5">
                                            <p className="text-sm font-medium leading-none">
                                                {t(label)}
                                            </p>
                                            <div className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={min}
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>{t("min")}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    {...field}
                                                                    onKeyDown={(event) => {
                                                                        if (
                                                                            event.code ===
                                                                                "Minus" ||
                                                                            event.code ===
                                                                                "NumpadSubtract" ||
                                                                            event.code ===
                                                                                "Period" ||
                                                                            event.code === "Comma"
                                                                        ) {
                                                                            event.preventDefault();
                                                                        }
                                                                    }}
                                                                    onChange={(e) => {
                                                                        if (
                                                                            Number(e.target.value) <
                                                                            0
                                                                        ) {
                                                                            field.onChange(0);
                                                                        } else {
                                                                            field.onChange(
                                                                                e.target.value
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={max}
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>{t("max")}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    onKeyDown={(event) => {
                                                                        if (
                                                                            event.code ===
                                                                                "Minus" ||
                                                                            event.code ===
                                                                                "NumpadSubtract" ||
                                                                            event.code ===
                                                                                "Period" ||
                                                                            event.code === "Comma"
                                                                        ) {
                                                                            event.preventDefault();
                                                                        }
                                                                    }}
                                                                    onChange={(e) => {
                                                                        if (
                                                                            Number(e.target.value) <
                                                                            0
                                                                        ) {
                                                                            field.onChange(0);
                                                                        } else {
                                                                            field.onChange(
                                                                                e.target.value
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-3 text-sm font-semibold">{t("vitamins")}</p>
                                <div className="flex flex-wrap gap-8">
                                    {vitaminsNames.map((vitamin) => (
                                        <FormField
                                            key={vitamin}
                                            control={form.control}
                                            name="vitamins"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormLabel>{vitamin}</FormLabel>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value.includes(vitamin)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([
                                                                          ...field.value,
                                                                          vitamin,
                                                                      ])
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              (value) =>
                                                                                  value !== vitamin
                                                                          )
                                                                      );
                                                            }}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="mt-3 text-sm font-medium leading-none">
                                    {t("minerals")}
                                </p>
                                <div className="flex flex-wrap gap-8">
                                    {mineralsNames.map((mineral) => (
                                        <FormField
                                            control={form.control}
                                            name="minerals"
                                            key={mineral}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormLabel>{t(mineral)}</FormLabel>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value.includes(mineral)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([
                                                                          ...field.value,
                                                                          mineral,
                                                                      ])
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              (value) =>
                                                                                  value !== mineral
                                                                          )
                                                                      );
                                                            }}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="mt-3 text-sm font-medium leading-none">
                                    {t("allergens")}
                                </p>
                                <div className="flex flex-wrap gap-8">
                                    {!isAllergensLoading &&
                                        allergens?.map((allergen) => (
                                            <FormField
                                                control={form.control}
                                                name="allergens"
                                                key={allergen}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormLabel>{allergen}</FormLabel>
                                                        <FormControl>
                                                            <Checkbox
                                                                className="border-red-700 data-[state=checked]:bg-red-700"
                                                                checked={field.value.includes(
                                                                    allergen
                                                                )}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([
                                                                              ...field.value,
                                                                              allergen,
                                                                          ])
                                                                        : field.onChange(
                                                                              field.value?.filter(
                                                                                  (value) =>
                                                                                      value !==
                                                                                      allergen
                                                                              )
                                                                          );
                                                                }}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                </div>
                                <div className="flex w-full gap-5">
                                    <Button className="flex-1" type="submit">
                                        {t("search")}
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={() => form.reset()}>
                                        {t("clear")}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default BasketFilters;
