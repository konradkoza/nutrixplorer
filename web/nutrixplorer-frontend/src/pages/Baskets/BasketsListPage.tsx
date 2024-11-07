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
                    <div className="container mt-10 flex w-full flex-col items-center gap-5 xl:flex-row xl:flex-wrap">
                        {baskets?.map((basket) => (
                            <Card
                                className="w-full sm:w-2/3 xl:w-[calc(50%-1rem)]"
                                key={basket.id}>
                                <CardHeader>
                                    <CardTitle>{basket.name}</CardTitle>
                                    <CardDescription>
                                        {basket.description}
                                    </CardDescription>
                                    <CardContent>
                                        <Table>
                                            <TableBody>
                                                {basket.basketEntries.map(
                                                    (entry) => (
                                                        <TableRow
                                                            key={entry.id}
                                                            className="hover:bg-inherit">
                                                            <TableCell>
                                                                {
                                                                    entry
                                                                        .product
                                                                        .productName
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-nowrap">
                                                                {entry.units +
                                                                    " " +
                                                                    entry
                                                                        .product
                                                                        .unit ||
                                                                    ""}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="default"
                                            onClick={() =>
                                                navigate(`${basket.id}`)
                                            }>
                                            Szczegóły
                                        </Button>
                                    </CardFooter>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default BasketsListPage;
