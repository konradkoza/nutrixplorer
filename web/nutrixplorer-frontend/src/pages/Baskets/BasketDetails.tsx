import { useParams } from "react-router-dom";
import { useGetBasketDetailsQuery } from "@/redux/services/basketService.ts";

const BasketDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { data: basket, isLoading } = useGetBasketDetailsQuery(id!, {
        skip: !id,
    });

    return (
        <div>
            <h1>Basket details id {id}</h1>
            {!isLoading && <p>data: {JSON.stringify(basket)}</p>}
        </div>
    );
};

export default BasketDetails;
