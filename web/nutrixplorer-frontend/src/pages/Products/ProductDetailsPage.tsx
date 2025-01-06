import imageAlt from "@/assets/notFound.png";
import LabeledText from "@/components/common/LabeledText.tsx";
import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import ProductIndexes from "@/pages/Products/ProductIndexes.tsx";
import { useGetProductDetailsQuery } from "@/redux/services/productService.ts";
import { useParams } from "react-router-dom";
import NutritionTable from "./NutritionTable";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useMemo, useState } from "react";
import {
    useAddFavouriteMutation,
    useDeleteFavoriteMutation,
    useGetMyFavouriteProductsQuery,
} from "@/redux/services/favouriteProductsService";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { AccessLevel } from "@/types/UserTypes";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ShoppingBasketIcon } from "lucide-react";
import AddToBasketDialog from "./AddToBasketDialog";

const ProductDetailsPage = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [setFavourite] = useAddFavouriteMutation();
    const [deleteFavourite] = useDeleteFavoriteMutation();
    const { accessLevels, token } = useSelector((state: RootState) => state.authSlice);
    const { data: favouriteProducts } = useGetMyFavouriteProductsQuery(undefined, {
        skip: !accessLevels.includes(AccessLevel.CLIENT),
    });
    const { id } = useParams<{ id: string }>();
    const { data: productDetails, isLoading } = useGetProductDetailsQuery(id!, {
        skip: !id,
    });

    const isFavourite = useMemo(() => {
        return (
            favouriteProducts !== undefined &&
            favouriteProducts.some((product) => product.id === id)
        );
    }, [favouriteProducts, id]);

    const { t } = useTranslation(TranslationNS.Products);
    const breadcrumbs = useBreadcrumbs([
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.products"), path: "/products" },
        { title: productDetails?.productName || t("breadcrumbs.product"), path: `/products/${id}` },
    ]);

    return (
        <>
            <div className="flex justify-center">
                {isLoading ? (
                    <Spinner />
                ) : productDetails ? (
                    <div className="container flex flex-col gap-2">
                        {breadcrumbs}
                        <div className="flex w-full flex-col gap-2 sm:flex-row">
                            <Card className="flex items-center justify-center bg-white p-5 sm:w-1/3">
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/product/${productDetails.id}/image`}
                                    alt={t("imageAlt")}
                                    className="max-h-80"
                                    onError={(event) => {
                                        event.currentTarget.src = imageAlt;
                                    }}
                                />
                            </Card>
                            <div className="relative flex flex-grow basis-0 flex-col sm:w-2/3">
                                {favouriteProducts !== undefined && (
                                    <div className="absolute right-0 m-1 flex h-auto flex-col space-y-1">
                                        {!isFavourite ? (
                                            <Button
                                                className="rounded-[0.5rem] bg-secondary/20"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFavourite(id!);
                                                }}>
                                                <FaRegHeart />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                className="rounded-[0.5rem] bg-secondary/20"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteFavourite(id!);
                                                }}>
                                                <FaHeart />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            className="rounded-[0.5rem] bg-secondary/20"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDialogOpen(true);
                                            }}>
                                            <ShoppingBasketIcon />
                                        </Button>
                                    </div>
                                )}
                                <Card className="min-h-32">
                                    <CardHeader>
                                        <CardTitle>{productDetails.productName}</CardTitle>

                                        <CardDescription className="my-2">
                                            {productDetails.producer
                                                ? `${t("producer")}: ${productDetails.producer.name}`
                                                : ""}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {productDetails.productDescription
                                            ? productDetails.productDescription
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              productDetails.productDescription.slice(1)
                                            : ""}
                                    </CardContent>
                                </Card>
                                <div className="pt-2">
                                    {productDetails.ratings.map((rating) => (
                                        <Badge
                                            key={rating.name}
                                            className="mx-1 mt-1 bg-primary/75 text-sm"
                                            variant="default">
                                            {rating.name.charAt(0).toUpperCase() +
                                                rating.name.slice(1)}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Card className="w-full p-5">
                            <CardHeader>
                                <CardTitle>{t("ingredientsTitle")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {productDetails.productQuantity && (
                                    <LabeledText
                                        label={t("quantity")}
                                        text={
                                            productDetails.productQuantity +
                                                " " +
                                                productDetails.unit || ""
                                        }
                                    />
                                )}

                                <LabeledText
                                    label={t("ingredients")}
                                    text={productDetails.composition.ingredients.join(", ")}
                                />

                                {productDetails.composition.additions.length > 0 && (
                                    <LabeledText
                                        label={t("additions")}
                                        text={productDetails.composition.additions
                                            .map((addition) => "E" + addition)
                                            .join(", ")}
                                    />
                                )}
                                {productDetails.composition.flavour && (
                                    <LabeledText
                                        label={t("flavour")}
                                        text={productDetails.composition.flavour}
                                    />
                                )}

                                <NutritionTable
                                    nutritions={productDetails.nutritionalValues}
                                    portion={productDetails.portion}
                                />
                            </CardContent>
                        </Card>
                        <Card className="w-full p-5">
                            <CardHeader>
                                <CardTitle>{t("indexesTitle")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProductIndexes
                                    indexes={productDetails.productIndexes}
                                    nutritionalIndexes={productDetails.nutritionalIndexes}
                                    energy={
                                        productDetails.nutritionalValues.find(
                                            (element) =>
                                                element.nutritionalValueName.group ===
                                                "Wartość Energetyczna"
                                        )?.quantity || 0
                                    }
                                    key={productDetails.id + "indexes"}
                                />
                            </CardContent>
                        </Card>
                        <Card className="w-full p-5">
                            <CardHeader>
                                <CardTitle>{t("additionalInfoTitle")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LabeledText
                                    label={t("packaging")}
                                    text={productDetails.packageType}
                                />

                                <LabeledText label={t("country")} text={productDetails.country} />

                                <LabeledText label={t("ean")} text={productDetails.ean} />

                                {productDetails.label.instructionsAfterOpening && (
                                    <LabeledText
                                        label={t("instructionsAfterOpening")}
                                        text={productDetails.label.instructionsAfterOpening}
                                    />
                                )}
                                {productDetails.label.storage && (
                                    <LabeledText
                                        label={t("storage")}
                                        text={productDetails.label.storage}
                                    />
                                )}

                                {productDetails.label.durability && (
                                    <LabeledText
                                        label={t("durability")}
                                        text={productDetails.label.durability}
                                    />
                                )}

                                {productDetails.label.allergens && (
                                    <LabeledText
                                        label={t("allergens")}
                                        text={productDetails.label.allergens}
                                    />
                                )}

                                {productDetails.label.preparation && (
                                    <LabeledText
                                        label={t("preparation")}
                                        text={productDetails.label.preparation}
                                    />
                                )}
                            </CardContent>
                        </Card>
                        <Card className="w-full p-5">
                            <CardHeader>
                                <CardTitle>{t("producerTitle")}</CardTitle>
                            </CardHeader>
                            {productDetails.producer ? (
                                <>
                                    <CardContent>
                                        {productDetails.producer.name && (
                                            <LabeledText
                                                label={t("producerName")}
                                                text={productDetails.producer.name}
                                            />
                                        )}

                                        {productDetails.producer.address && (
                                            <LabeledText
                                                label={t("producerAddress")}
                                                text={productDetails.producer.address}
                                            />
                                        )}

                                        {productDetails.producer.contact && (
                                            <LabeledText
                                                label={t("producerContact")}
                                                text={productDetails.producer.contact}
                                            />
                                        )}
                                    </CardContent>
                                </>
                            ) : (
                                <CardContent>{t("noProducerInfo")}</CardContent>
                            )}
                        </Card>
                        {token && (
                            <AddToBasketDialog
                                open={dialogOpen}
                                productId={id!}
                                onClose={() => setDialogOpen(false)}
                                unit={productDetails?.unit || ""}
                                productName={productDetails?.productName || ""}
                            />
                        )}
                    </div>
                ) : (
                    <div>{t("productNotFound")}</div>
                )}
            </div>
        </>
    );
};

export default ProductDetailsPage;
