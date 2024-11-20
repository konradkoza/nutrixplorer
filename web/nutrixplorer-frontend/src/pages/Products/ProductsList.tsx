import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardImage } from "@/components/ui/card.tsx";
import {
    useAddFavouriteMutation,
    useDeleteFavoriteMutation,
} from "@/redux/services/favouriteProductsService.ts";
import { SimpleProduct } from "@/types/ProductTypes.ts";
import { ShoppingBasketIcon } from "lucide-react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddToBasketDialog from "./AddToBasketDialog";
import image from "@/assets/notFound.png";

type ProductsListProps = {
    products: SimpleProduct[];
    favouriteProducts?: SimpleProduct[];
    addToBasket?: boolean;
};

const ProductsList = ({ products, favouriteProducts, addToBasket }: ProductsListProps) => {
    const navigate = useNavigate();
    const [setFavourite] = useAddFavouriteMutation();
    const [deleteFavourite] = useDeleteFavoriteMutation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [productId, setProductId] = useState<string>("");
    const isFavourite = (id: string): boolean => {
        return (
            favouriteProducts !== undefined &&
            favouriteProducts.some((product) => product.id === id)
        );
    };

    const handleSetFavourite = (id: string) => {
        setFavourite(id);
    };

    const handleDeleteFavourite = (id: string) => {
        deleteFavourite(id);
    };

    const handleOpenDialog = (productId: string) => {
        setProductId(productId);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setProductId("");
        setDialogOpen(false);
    };

    return (
        <div className="container grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
            {products.map((product) => (
                <Card
                    onClick={() => {
                        navigate(`/products/${product.id}`);
                    }}
                    key={product.id}
                    className="relative min-w-52 flex-shrink-0 flex-grow-0 hover:bg-secondary/95">
                    {favouriteProducts !== undefined && (
                        <div className="absolute right-0 m-1 flex h-auto flex-col space-y-1">
                            {!isFavourite(product.id) ? (
                                <Button
                                    className="rounded-[0.5rem] bg-secondary/20"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetFavourite(product.id);
                                    }}>
                                    <FaRegHeart />
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    className="rounded-[0.5rem] bg-secondary/20"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFavourite(product.id);
                                    }}>
                                    <FaHeart />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                className="rounded-[0.5rem] bg-secondary/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDialog(product.id);
                                }}>
                                <ShoppingBasketIcon />
                            </Button>
                        </div>
                    )}
                    <div className="flex justify-center bg-white">
                        <CardImage
                            src={`${import.meta.env.VITE_BACKEND_URL}/product/${product.id}/image`}
                            alt="Brak zdjęcia"
                            className="h-52 w-auto"
                            onError={(event) => {
                                event.currentTarget.src = image;
                            }}
                        />
                    </div>

                    <CardHeader>
                        <h2>{product.productName}</h2>
                    </CardHeader>
                    <CardContent className="max-h-full">
                        <p>{product.productDescription}</p>
                    </CardContent>
                    <CardFooter>
                        {product.productQuantity ? product.productQuantity.toString() : ""}{" "}
                        {product.unit || ""}
                    </CardFooter>
                </Card>
            ))}
            {addToBasket && (
                <AddToBasketDialog
                    open={dialogOpen}
                    productId={productId}
                    onClose={() => handleCloseDialog()}
                />
            )}
        </div>
    );
};

export default ProductsList;
