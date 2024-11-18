import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion.tsx";

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
    vitamins: Vitamin[];
    minerals: Mineral[];
};

type Vitamin = "B7" | "K" | "B2" | "B6" | "C" | "B1" | "B5" | "D" | "B9" | "E" | "A" | "B12" | "B3";
type Mineral =
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

type FilteringComponentProps = {
    setFilters: (data: FilteringFormType) => void;
};

const FilteringComponent = ({ setFilters }: FilteringComponentProps) => {
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
            vitamins: [],
            minerals: [],
        },
        resetOptions: {
            keepDefaultValues: true,
        },
    });

    const onSubmit = (data: FilteringFormType) => {
        const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== "" && value !== undefined) {
                (acc as any)[key] = value;
            }
            return acc;
        }, {} as FilteringFormType);
        setFilters(filteredData);
    };

    return (
        <div className="container w-full">
            <Accordion type="single" collapsible className="mb-5 w-full bg-card/90 px-5">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Filtry</AccordionTrigger>
                    <AccordionContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="m-2 flex flex-col gap-5">
                                <div className="flex w-full flex-wrap gap-5">
                                    <FormField
                                        control={form.control}
                                        name="productName"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-1/4">
                                                <FormLabel>Nazwa</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ean"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-1/4">
                                                <FormLabel>EAN</FormLabel>
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
                                                <FormLabel>Opis</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex w-full flex-wrap gap-5">
                                    <div className="flex max-w-[480px] flex-grow flex-col gap-5">
                                        <FormLabel>Węglowodany</FormLabel>
                                        <div className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name="minCarbs"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Od:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxCarbs"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Do:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex max-w-[480px] flex-grow flex-col gap-5">
                                        <FormLabel>Tłuszcz</FormLabel>
                                        <div className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name="minFat"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Od:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxFat"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Do:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex max-w-[480px] flex-grow flex-col gap-5">
                                        <FormLabel>Białko</FormLabel>
                                        <div className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name="minProtein"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Od:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxProtein"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Do:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex max-w-[480px] flex-grow flex-col gap-5">
                                        <FormLabel>Błonnik</FormLabel>
                                        <div className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name="minFiber"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Od:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxFiber"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Do:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex max-w-[480px] flex-grow flex-col gap-5">
                                        <FormLabel>Wartość energetyczna</FormLabel>
                                        <div className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name="minEnergy"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Od:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxEnergy"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Do:</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <FormLabel>Witaminy</FormLabel>
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
                                <FormLabel>Minerały</FormLabel>
                                <div className="flex flex-wrap gap-4">
                                    {mineralsNames.map((mineral) => (
                                        <FormField
                                            control={form.control}
                                            name="minerals"
                                            key={mineral}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormLabel>{mineral}</FormLabel>
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
                                <div className="flex w-full gap-5">
                                    <Button className="flex-1" type="submit">
                                        Szukaj
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={() => form.reset()}>
                                        Wyczyść
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
