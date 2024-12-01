import { Table, TableCell, TableFooter, TableHead, TableRow } from "@/components/ui/table";
import { NutritionalIndex, ProductIndex } from "@/types/ProductTypes.ts";
import {
    getEnergyIndex,
    getIndexColor,
    IndexName,
    productIndexesNames,
    returnIndexValue,
} from "@/utils/productUtils";
import IndexCircle from "./IndexCircle";

type ProductIndexesProps = {
    indexes: ProductIndex[];
    nutritionalIndexes: NutritionalIndex[];
    energy: number;
};

const ProductIndexes = ({ indexes, nutritionalIndexes, energy }: ProductIndexesProps) => {
    return (
        <div>
            {/* <IndexCircle
                textInside={returnIndexValue("E", indexes).toString()}
                borderColor={getIndexColor(energy, "E")}
                label="Indeks EN"
                size={100}
                borderThickness={8}
            /> */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
                {productIndexesNames.map((index) => (
                    <IndexCircle
                        key={index.name}
                        textInside={
                            index.name === "E"
                                ? getEnergyIndex(energy)
                                : returnIndexValue(index.name as IndexName, indexes).toString()
                        }
                        borderColor={getIndexColor(
                            index.name === "E"
                                ? energy
                                : returnIndexValue(index.name as IndexName, indexes),
                            index.name as IndexName
                        )}
                        label={`Indeks ${index.name === "E" ? "EN" : index.displayName}`}
                        size={100}
                        borderThickness={12}
                    />
                ))}
            </div>
            <Table className="text-md mt-5">
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
