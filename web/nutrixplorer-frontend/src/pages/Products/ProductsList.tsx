import { SimpleProduct } from "@/types/ProductTypes.ts";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardImage,
} from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button.tsx";
import {
    useAddFavouriteMutation,
    useDeleteFavoriteMutation,
} from "@/redux/services/favouriteProductsService.ts";

type ProductsListProps = {
    products: SimpleProduct[];
    images: string[];
    setImageToDefault: (index: number) => void;
    favouriteProducts?: SimpleProduct[];
};

const ProductsList = ({
    products,
    images,
    setImageToDefault,
    favouriteProducts,
}: ProductsListProps) => {
    const navigate = useNavigate();
    const [setFavourite] = useAddFavouriteMutation();
    const [deleteFavourite] = useDeleteFavoriteMutation();
    const isFavourite = (id: string): boolean => {
        return (
            favouriteProducts !== undefined &&
            favouriteProducts.some((product) => product.id === id)
        );
    };

    const handleSetFavourite = (id: string) => {
        setFavourite(id);
        console.log("clicked");
    };

    const handleDeleteFavourite = (id: string) => {
        deleteFavourite(id);
        console.log("clicked");
    };

    return (
        <div className="container grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
            {products.map((product, index) => (
                <Card
                    onClick={() => {
                        navigate(`/products/${product.id}`);
                    }}
                    key={product.id}
                    className="relative min-w-52 flex-shrink-0 flex-grow-0 hover:bg-secondary/95">
                    <div className="absolute right-0 m-1 flex flex-col">
                        {!isFavourite(product.id) ? (
                            <Button
                                className="rounded-[0.5rem]"
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
                                className="rounded-[0.5rem]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFavourite(product.id);
                                }}>
                                <FaHeart />
                            </Button>
                        )}
                    </div>
                    <div className="flex justify-center bg-white">
                        <CardImage
                            src={images[index]}
                            alt="Brak zdjęcia"
                            className="h-52 w-auto"
                            onError={() => setImageToDefault(index)}
                        />
                    </div>

                    <CardHeader>
                        <h2>{product.productName}</h2>
                    </CardHeader>
                    <CardContent className="max-h-full">
                        <p>{product.productDescription}</p>
                    </CardContent>
                    <CardFooter>
                        {product.productQuantity
                            ? product.productQuantity.toString()
                            : ""}{" "}
                        {product.unit || ""}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default ProductsList;
