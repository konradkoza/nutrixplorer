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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mineralsNames, vitaminsNames } from "@/constants/NutritionConstants";
import {
    useGetAllCountriesQuery,
    useGetPackageTypesQuery,
    useGetProductByNameQuery,
} from "@/redux/services/productService";
import { Mineral, Vitamin } from "@/types/NutritionalValueTypes";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

export type FilteringFormType = {
    productName: string | undefined;
    description: string | undefined;
    ean: string | undefined;
    country: string | undefined;
    minCarbs: string | undefined;
    maxCarbs: string | undefined;
    minFat: string | undefined;
    maxFat: string | undefined;
    minProtein: string | undefined;
    maxProtein: string | undefined;
    minFiber: string | undefined;
    maxFiber: string | undefined;
    minEnergy: string | undefined;
    maxEnergy: string | undefined;
    minSalt: string | undefined;
    maxSalt: string | undefined;
    minSugar: string | undefined;
    maxSugar: string | undefined;
    minSaturatedFat: string | undefined;
    maxSaturatedFat: string | undefined;
    vitamins: Vitamin[];
    minerals: Mineral[];
    minIndexE: string | undefined;
    minIndexV: string | undefined;
    minIndexM: string | undefined;
    minIndexO: string | undefined;
    minIndexP: string | undefined;
    minIndexF: string | undefined;
    minIndexS: string | undefined;
    minIndexT: string | undefined;
    packageType: string | undefined;
};

const indexFields = [
    { min: "minIndexE", label: "EN" },
    { min: "minIndexV", label: "VIT" },
    { min: "minIndexM", label: "MIN" },
    { min: "minIndexO", label: "OM3" },
    { min: "minIndexP", label: "PRT" },
    { min: "minIndexF", label: "FIB" },
    { min: "minIndexS", label: "SUM" },
    { min: "minIndexT", label: "FF" },
] satisfies { min: keyof FilteringFormType; label: string }[];

type FilteringComponentProps = {
    setFilters: (data: FilteringFormType) => void;
};

const FilteringComponent = ({ setFilters }: FilteringComponentProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [value] = useDebounce(searchValue, 300);
    const { data: productsByName, isFetching } = useGetProductByNameQuery(value);
    const { data: packageTypes, isLoading: isPackageTypesLoading } = useGetPackageTypesQuery();
    const { data: countries, isLoading: isCountriesLoading } = useGetAllCountriesQuery();
    const [t] = useTranslation(TranslationNS.Products);
    const form = useForm<FilteringFormType>({
        values: {
            productName: "",
            description: "",
            ean: "",
            country: "",
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
            minIndexE: "",
            minIndexV: "",
            minIndexM: "",
            minIndexO: "",
            minIndexP: "",
            minIndexF: "",
            minIndexS: "",
            minIndexT: "",
            packageType: "",
        },
        resetOptions: {
            keepDefaultValues: true,
        },
    });
    const minMaxFields = [
        {
            min: "minCarbs",
            max: "maxCarbs",
            label: t("filters.carbs") + " " + t("filters.per100g"),
        },
        { min: "minFat", max: "maxFat", label: t("filters.fats") },
        {
            min: "minProtein",
            max: "maxProtein",
            label: t("filters.proteins") + " " + t("filters.per100g"),
        },
        {
            min: "minFiber",
            max: "maxFiber",
            label: t("filters.fiber") + " " + t("filters.per100g"),
        },
        {
            min: "minEnergy",
            max: "maxEnergy",
            label: t("filters.calories") + " " + t("filters.per100g"),
        },
        { min: "minSalt", max: "maxSalt", label: t("filters.salt") + " " + t("filters.per100g") },
        {
            min: "minSugar",
            max: "maxSugar",
            label: t("filters.sugar") + " " + t("filters.per100g"),
        },
        {
            min: "minSaturatedFat",
            max: "maxSaturatedFat",
            label: t("filters.saturatedFats") + " " + t("filters.per100g"),
        },
    ] satisfies { min: keyof FilteringFormType; max: keyof FilteringFormType; label: string }[];

    const onSubmit = (data: FilteringFormType) => {
        const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== "" && value !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (acc as any)[key] = value;
            }
            return acc;
        }, {} as FilteringFormType);
        setFilters(filteredData);
    };

    return (
        <div className="container w-full">
            <Accordion type="single" collapsible className="mb-5 w-full bg-muted/90 px-5">
                <AccordionItem value="item-1">
                    <AccordionTrigger>{t("filters.filters")}</AccordionTrigger>
                    <AccordionContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="m-2 flex flex-col gap-5">
                                <div className="flex w-full flex-wrap gap-5">
                                    <div className="w-full flex-grow sm:w-1/4">
                                        <FormField
                                            control={form.control}
                                            name="productName"
                                            render={({ field }) => (
                                                <AutocompleteTextInput
                                                    searchValue={field.value || ""}
                                                    setSearchValue={(e) => {
                                                        field.onChange(e);
                                                        setSearchValue(e);
                                                    }}
                                                    suggestions={productsByName || []}
                                                    emptyMessage={t("noProducts")}
                                                    label={t("filters.name")}
                                                    isLoading={isFetching}
                                                />
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="ean"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-1/4">
                                                <FormLabel>{t("filters.ean")}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-2/4">
                                                <FormLabel>{t("filters.description")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
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
                                                {label}
                                            </p>
                                            <div className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={min}
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                {t("filters.min")}
                                                            </FormLabel>
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
                                                <FormField
                                                    control={form.control}
                                                    name={max}
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                {t("filters.max")}
                                                            </FormLabel>
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
                                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] flex-wrap gap-5">
                                    {indexFields.map(({ min, label }) => (
                                        <div key={label} className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name={min}
                                                render={({ field }) => (
                                                    <FormItem className="flex w-full flex-col justify-between gap-1">
                                                        <FormLabel>
                                                            {t("filters.minIndex")} {label}
                                                        </FormLabel>
                                                        <FormControl className="">
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onKeyDown={(event) => {
                                                                    if (
                                                                        event.code === "Minus" ||
                                                                        event.code ===
                                                                            "NumpadSubtract" ||
                                                                        event.code === "Period" ||
                                                                        event.code === "Comma"
                                                                    ) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => {
                                                                    if (
                                                                        Number(e.target.value) < 0
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
                                    ))}
                                </div>
                                <div className="flex w-full gap-5 xl:w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="packageType"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <p className="text-sm font-medium">
                                                    {t("filters.packaging")}
                                                </p>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}>
                                                    <SelectTrigger className="w-full flex-grow">
                                                        <SelectValue
                                                            placeholder={t("filters.packaging")}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                {t("filters.packagingType")}
                                                            </SelectLabel>
                                                            {!isPackageTypesLoading &&
                                                                packageTypes?.map((packageType) => (
                                                                    <SelectItem
                                                                        key={packageType}
                                                                        value={packageType}>
                                                                        {packageType}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <p className="text-sm font-medium">
                                                    {t("filters.country")}
                                                </p>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}>
                                                    <SelectTrigger className="">
                                                        <SelectValue
                                                            placeholder={t("filters.country")}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Kraj</SelectLabel>
                                                            {!isCountriesLoading &&
                                                                countries?.map((country) => (
                                                                    <SelectItem
                                                                        key={country}
                                                                        value={country}>
                                                                        {country}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <p className="text-sm font-medium leading-none">
                                    {t("filters.vitamins")}
                                </p>
                                <div className="flex flex-wrap gap-4">
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
                                <p className="text-sm font-medium leading-none">
                                    {t("filters.minerals")}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {mineralsNames.map((mineral) => (
                                        <FormField
                                            control={form.control}
                                            name="minerals"
                                            key={mineral}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormLabel>{t(`filters.${mineral}`)}</FormLabel>
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
                                <div className="flex w-full gap-5">
                                    <Button className="flex-1" type="submit">
                                        {t("filters.search")}
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={() => form.reset()}>
                                        {t("filters.reset")}
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

export default FilteringComponent;
