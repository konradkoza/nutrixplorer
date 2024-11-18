import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetMyBasketsQuery } from "@/redux/services/basketService";
import { useNavigate } from "react-router-dom";

const BasketsListPage = () => {
    const { data: baskets, isLoading } = useGetMyBasketsQuery();
    const navigate = useNavigate();
    return (
        <>
            <h1 className="font-semi-bold text-3xl">Twoje koszyki</h1>
            <div className="flex flex-col items-center">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="container mt-10 flex h-full w-full flex-col items-stretch gap-5 xl:flex-row xl:flex-wrap">
                        {baskets?.map((basket) => (
                            <Card
                                className="flex w-full flex-col sm:w-2/3 xl:w-[calc(50%-1rem)]"
                                key={basket.id}>
                                <CardHeader className="">
                                    <CardTitle>{basket.name}</CardTitle>
                                    <CardDescription>{basket.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <Table>
                                        <TableBody>
                                            {basket.basketEntries.map((entry) => (
                                                <TableRow
                                                    key={entry.id}
                                                    className="hover:bg-inherit">
                                                    <TableCell>
                                                        {entry.product.productName}
                                                    </TableCell>
                                                    <TableCell className="text-nowrap">
                                                        {entry.units + " " + entry.product.unit ||
                                                            ""}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className="">
                                    <Button
                                        variant="default"
                                        onClick={() => navigate(`${basket.id}`)}>
                                        Szczegóły
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default BasketsListPage;
