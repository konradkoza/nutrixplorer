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
import { useGetAllergensQuery } from "@/redux/services/productService";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/types/TranslationNamespaces";

export type BasketFiltersFormType = {
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
    vitamins: Vitamin[];
    minerals: Mineral[];
    allergens: string[];
};

const minMaxFields = [
    { min: "minCarbs", max: "maxCarbs", label: "carbs" },
    { min: "minFat", max: "maxFat", label: "fat" },
    { min: "minProtein", max: "maxProtein", label: "protein" },
    { min: "minFiber", max: "maxFiber", label: "fiber" },
    { min: "minEnergy", max: "maxEnergy", label: "energyValue" },
] satisfies { min: keyof BasketFiltersFormType; max: keyof BasketFiltersFormType; label: string }[];

export type Vitamin =
    | "B7"
    | "K"
    | "B2"
    | "B6"
    | "C"
    | "B1"
    | "B5"
    | "D"
    | "B9"
    | "E"
    | "A"
    | "B12"
    | "B3";
export type Mineral =
    | "Magnez"
    | "Fluorek"
    | "Mangan"
    | "Wapń"
    | "Miedź"
    | "Żelazo"
    | "Selen"
    | "Molibden"
    | "Fosfor"
    | "Jod"
    | "Chrom"
    | "Potas"
    | "Cynk";

const vitaminsNames: Vitamin[] = [
    "B7",
    "K",
    "B2",
    "B6",
    "C",
    "B1",
    "B5",
    "D",
    "B9",
    "E",
    "A",
    "B12",
    "B3",
];

const mineralsNames: Mineral[] = [
    "Magnez",
    "Fluorek",
    "Mangan",
    "Wapń",
    "Miedź",
    "Żelazo",
    "Selen",
    "Molibden",
    "Fosfor",
    "Jod",
    "Chrom",
    "Potas",
    "Cynk",
];

type BasketFiltersProps = {
    setFilters: (data: any) => void;
};

const BasketFilters = ({ setFilters }: BasketFiltersProps) => {
    const { t } = useTranslation(TranslationNS.Baskets);
    const { data: allergens, isLoading: isAllergensLoading } = useGetAllergensQuery();
    const form = useForm<BasketFiltersFormType>({
        values: {
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
                                                                <Input type="number" {...field} />
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
                                                                <Input type="number" {...field} />
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
                                                                console.log(field.value);
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
                                                                console.log(field.value);
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
                                                                    console.log(field.value);
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
