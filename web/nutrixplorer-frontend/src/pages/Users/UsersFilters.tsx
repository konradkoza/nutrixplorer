import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { UserFilters, AccessLevel } from "@/types/UserTypes";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type UsersFiltersProps = {
    setFilters: (filters: UserFilters) => void;
};

const UsersFilters = ({ setFilters }: UsersFiltersProps) => {
    const [t] = useTranslation(TranslationNS.Users);
    const form = useForm<UserFilters>({
        values: {
            email: "",
            firstName: "",
            lastName: "",
            accessLevel: undefined,
        },
        resetOptions: {
            keepDefaultValues: true,
        },
    });

    const onSubmit = (data: UserFilters) => {
        setFilters(data);
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
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-1/4">
                                                <FormLabel>{t("filters.email")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-1/4">
                                                <FormLabel>{t("filters.firstName")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-1/4">
                                                <FormLabel>{t("filters.lastName")}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accessLevel"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex-grow sm:w-1/4">
                                                <FormLabel>{t("filters.accessLevel")}</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        <SelectTrigger className="w-full flex-grow">
                                                            <SelectValue
                                                                placeholder={t(
                                                                    "filters.accessLevel"
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>
                                                                    {t("filters.accessLevel")}
                                                                </SelectLabel>
                                                                <SelectItem
                                                                    value={AccessLevel.CLIENT}>
                                                                    {AccessLevel.CLIENT}
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value={
                                                                        AccessLevel.ADMINISTRATOR
                                                                    }>
                                                                    {AccessLevel.ADMINISTRATOR}
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
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

export default UsersFilters;
