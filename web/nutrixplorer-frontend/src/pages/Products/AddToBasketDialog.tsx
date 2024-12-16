import { AutoComplete } from "@/components/common/Autocomplete";
import { UnitInput } from "@/components/common/UnitInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
    useAddBasketEntryMutation,
    useGetFilteredBasketsListQuery,
} from "@/redux/services/basketService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import AddBasketDialog from "../Baskets/AddBasketDialog";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/types/TranslationNamespaces";

type AddToBasketDialogProps = {
    open: boolean;
    onClose: () => void;
    productId: string;
    unit: string;
    productName: string;
};

type AddToBasketForm = {
    quantity: number;
    basketId: string;
};

const AddToBasketDialog = ({
    open,
    onClose,
    productId,
    unit,
    productName,
}: AddToBasketDialogProps) => {
    const { t } = useTranslation(TranslationNS.Products);
    const [searchValue, setSearchValue] = useState<string>("");
    const [value] = useDebounce(searchValue, 100);
    const { data: basketList, isLoading } = useGetFilteredBasketsListQuery(value);
    // const { data: basketList, isLoading } = useGetUserBasketsListQuery();

    const [addEntry] = useAddBasketEntryMutation();
    const form = useForm<AddToBasketForm>({
        values: {
            quantity: 0,
            basketId: "",
        },
    });

    const handleAddToBasket = (data: AddToBasketForm) => {
        addEntry({ basketId: data.basketId, entry: { productId, quantity: data.quantity } });
        onClose();
        form.reset();
    };

    const close = () => {
        setSearchValue("");
        form.reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent>
                <DialogTitle>
                    {t("addToBasket.addToBasket")} ({productName})
                </DialogTitle>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddToBasket)}>
                        <div className="flex-col justify-around sm:flex sm:flex-row">
                            <FormField
                                control={form.control}
                                name="basketId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("addToBasket.basket")}</FormLabel>
                                        <AutoComplete
                                            selectedValue={field.value}
                                            onSelectedValueChange={field.onChange}
                                            searchValue={searchValue}
                                            onSearchValueChange={setSearchValue}
                                            items={
                                                basketList
                                                    ? basketList.map((basket) => {
                                                          return {
                                                              value: basket.id,
                                                              label: basket.name,
                                                          };
                                                      })
                                                    : []
                                            }
                                            isLoading={isLoading}
                                            emptyMessage={t("addToBasket.noBaskets")}
                                            placeholder={t("addToBasket.search")}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-[180px]">
                                        <FormLabel>{t("addToBasket.quantity")}</FormLabel>
                                        <FormControl>
                                            <UnitInput
                                                autoFocus
                                                className=""
                                                unit={unit}
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-5 flex flex-row justify-between gap-5 sm:flex-row sm:justify-between">
                            <AddBasketDialog />
                            <div className="flex gap-5">
                                <Button onClick={onClose} type="button" variant="outline">
                                    {t("addToBasket.cancel")}
                                </Button>
                                <Button type="submit">{t("addToBasket.add")}</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddToBasketDialog;
