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

const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: productDetails, isLoading } = useGetProductDetailsQuery(id!, {
        skip: !id,
    });
    const breadcrumbs = useBreadcrumbs([
        { title: "NutriXplorer", path: "/" },
        { title: "Produkty", path: "/products" },
        { title: productDetails?.productName || "Produkt", path: `/products/${id}` },
    ]);

    if (!id) {
        return <div>Product ID is missing</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                                    alt="Brak zdjęcia"
                                    className="max-h-80"
                                    onError={(event) => {
                                        event.currentTarget.src = imageAlt;
                                    }}
                                />
                            </Card>
                            <div className="flex flex-grow basis-0 flex-col sm:w-2/3">
                                <Card className="min-h-32">
                                    <CardHeader>
                                        <CardTitle>{productDetails.productName}</CardTitle>

                                        <CardDescription className="my-2">
                                            {productDetails.producer
                                                ? `Producent: ${productDetails.producer.name}`
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
                                <CardTitle>Składniki, dodatki i substancje odżywcze</CardTitle>
                            </CardHeader>
                            {productDetails.productQuantity && (
                                <CardContent>
                                    <LabeledText
                                        label={"Ilość:"}
                                        text={
                                            productDetails.productQuantity +
                                                " " +
                                                productDetails.unit || ""
                                        }
                                    />
                                </CardContent>
                            )}
                            <CardContent>
                                <LabeledText
                                    label={"Składniki:"}
                                    text={productDetails.composition.ingredients.join(", ")}
                                />
                            </CardContent>
                            {productDetails.composition.additions.length > 0 && (
                                <CardContent>
                                    <LabeledText
                                        label={"Dodatki:"}
                                        text={productDetails.composition.additions
                                            .map((addition) => "E" + addition)
                                            .join(", ")}
                                    />
                                </CardContent>
                            )}
                            {productDetails.composition.flavour && (
                                <CardContent>
                                    <LabeledText
                                        label={"Aromat:"}
                                        text={productDetails.composition.flavour}
                                    />
                                </CardContent>
                            )}
                            <CardContent>
                                <NutritionTable
                                    nutritions={productDetails.nutritionalValues}
                                    portion={productDetails.portion}
                                />
                            </CardContent>
                        </Card>
                        <Card className="w-full p-5">
                            <CardHeader>
                                <CardTitle>Indeksy</CardTitle>
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
                                <CardTitle>Dodatkowe informacje</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LabeledText
                                    label={"Opakowanie:"}
                                    text={productDetails.packageType}
                                />
                            </CardContent>
                            <CardContent>
                                <LabeledText label={"Kraj:"} text={productDetails.country} />
                            </CardContent>
                            <CardContent>
                                <LabeledText label={"EAN:"} text={productDetails.ean} />
                            </CardContent>
                            {productDetails.label.instructionsAfterOpening && (
                                <CardContent>
                                    <LabeledText
                                        label={"Po otwarciu przechowywać:"}
                                        text={productDetails.label.instructionsAfterOpening}
                                    />
                                </CardContent>
                            )}
                            {productDetails.label.storage && (
                                <CardContent>
                                    <LabeledText
                                        label={"Przechowywawanie:"}
                                        text={productDetails.label.storage}
                                    />
                                </CardContent>
                            )}
                            <CardContent>
                                {productDetails.label.durability && (
                                    <LabeledText
                                        label={"Trwałość:"}
                                        text={productDetails.label.durability}
                                    />
                                )}
                            </CardContent>
                            <CardContent>
                                {productDetails.label.allergens && (
                                    <LabeledText
                                        label={"Alergeny:"}
                                        text={productDetails.label.allergens}
                                    />
                                )}
                            </CardContent>
                            <CardContent>
                                {productDetails.label.preparation && (
                                    <LabeledText
                                        label={"Przygotowanie: "}
                                        text={productDetails.label.preparation}
                                    />
                                )}
                            </CardContent>
                        </Card>
                        <Card className="w-full p-5">
                            <CardHeader>
                                <CardTitle>Producent</CardTitle>
                            </CardHeader>
                            {productDetails.producer ? (
                                <>
                                    <CardContent>
                                        {productDetails.producer.name && (
                                            <LabeledText
                                                label={"Nazwa:"}
                                                text={productDetails.producer.name}
                                            />
                                        )}
                                    </CardContent>
                                    <CardContent>
                                        {productDetails.producer.address && (
                                            <LabeledText
                                                label={"Adres"}
                                                text={productDetails.producer.address}
                                            />
                                        )}
                                    </CardContent>
                                    <CardContent>
                                        {productDetails.producer.contact && (
                                            <LabeledText
                                                label={"Kontakt"}
                                                text={productDetails.producer.contact}
                                            />
                                        )}
                                    </CardContent>
                                </>
                            ) : (
                                <CardContent>Brak informacji o producencie</CardContent>
                            )}
                        </Card>
                    </div>
                ) : (
                    <div>Produkt nie istnieje</div>
                )}
            </div>
        </>
    );
};

export default ProductDetailsPage;
