import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h1>Product Details Page</h1>
            <p>Product ID: {id}</p>
        </div>
    );
};

export default ProductDetailsPage;
