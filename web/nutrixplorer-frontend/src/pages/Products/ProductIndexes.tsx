import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { NutritionalIndex, ProductIndex } from "@/types/ProductTypes.ts";
import {
    getEnergyIndex,
    IndexName,
    productIndexesNames,
    returnIndexValue,
} from "@/utils/productUtils";

type ProductIndexesProps = {
    indexes: ProductIndex[];
    nutritionalIndexes: NutritionalIndex[];
    energy: number;
};

const ProductIndexes = ({ indexes, nutritionalIndexes, energy }: ProductIndexesProps) => {
    return (
        <div>
            <Table className="text-md">
                <TableHeader>
                    <TableRow>
                        <TableHead>Indeks</TableHead>
                        <TableHead>Wartość</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productIndexesNames.map((index) => (
                        <TableRow key={index.name}>
                            <TableCell>{index.displayName}</TableCell>
                            <TableCell>
                                {index.name === "E"
                                    ? getEnergyIndex(energy)
                                    : returnIndexValue(index.name as IndexName, indexes)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableHead>Wartości odżywcze</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                    {nutritionalIndexes.map(
                        (element) =>
                            element.legend && (
                                <TableRow className="w-full" key={element.legend}>
                                    <TableCell>{element.legend}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )
                    )}
                </TableFooter>
            </Table>
        </div>
    );
};

export default ProductIndexes;
